import { describe, expect, it } from "vitest";

import { emptyDb } from "../db";
import type { Actor, Db, Unit, Warranty } from "../types";
import {
  deshacerEstadoGarantia,
  enviarATecnico,
  entregarGarantia,
  estadoAnteriorGarantia,
  garantiaTieneCliente,
  registrarDiagnostico,
} from "./warranties";

const admin: Actor = { id: "u1", email: "a@x.com", fullName: "Admin", role: "admin" };
const now = new Date().toISOString();

const unidad = (overrides: Partial<Unit> = {}): Unit => ({
  id: "un1", productId: "p1", serial: "354198263141008", condition: "seminuevo",
  status: "en_reparacion", receivedAt: now, createdBy: "u1", ...overrides,
});

const garantia = (overrides: Partial<Warranty> = {}): Warranty => ({
  id: "w1", code: "GAR-1", reason: "no enciende", status: "reenvio_pendiente",
  receivedAt: now, createdBy: "u1", resolucion: "reparado", unitId: "un1", ...overrides,
});

const dbCon = (warrantyOverrides: Partial<Warranty> = {}, unitOverrides: Partial<Unit> = {}): Db => {
  const db = emptyDb();
  db.units = [unidad(unitOverrides)];
  db.warranties = [garantia(warrantyOverrides)];
  return db;
};

describe("entregarGarantia · resolución reparado", () => {
  it("con cliente (una venta real): el equipo queda como entregado al cliente, como siempre", () => {
    const db = dbCon({ customerId: "c1" });
    entregarGarantia(db, admin, { warrantyId: "w1" });
    expect(db.units[0].status).toBe("entregado_garantia");
  });

  it("con pedido pero sin customerId explícito: también cuenta como venta real", () => {
    const db = dbCon({ orderId: "o1" });
    entregarGarantia(db, admin, { warrantyId: "w1" });
    expect(db.units[0].status).toBe("entregado_garantia");
  });

  it('sin cliente ni pedido ("falla en inventario"): el equipo vuelve a bodega, no queda "entregado"', () => {
    const db = dbCon({}); // sin customerId ni orderId
    entregarGarantia(db, admin, { warrantyId: "w1" });
    expect(db.units[0].status).toBe("en_bodega");
  });

  it("sin cliente ni pedido: el caso de garantía igual se cierra (status entregado)", () => {
    const db = dbCon({});
    const resultado = entregarGarantia(db, admin, { warrantyId: "w1" });
    expect(resultado.status).toBe("entregado");
    expect(resultado.resolvedAt).toBeTruthy();
  });

  it("sin cliente ni pedido: el movimiento registrado dice explícitamente que no hay cliente", () => {
    const db = dbCon({});
    entregarGarantia(db, admin, { warrantyId: "w1" });
    const movimiento = db.movements.find((m) => m.unitId === "un1");
    expect(movimiento?.notes).toContain("sin cliente");
  });
});

describe("entregarGarantia · con cliente, pero se decide no devolverlo (devolverABodega)", () => {
  it("con cliente y devolverABodega: true, el equipo vuelve a bodega en vez de entregarse", () => {
    const db = dbCon({ customerId: "c1" });
    entregarGarantia(db, admin, { warrantyId: "w1", devolverABodega: true });
    expect(db.units[0].status).toBe("en_bodega");
  });

  it("con cliente y devolverABodega: false (o sin mandarlo), se entrega como siempre", () => {
    const db = dbCon({ customerId: "c1" });
    entregarGarantia(db, admin, { warrantyId: "w1", devolverABodega: false });
    expect(db.units[0].status).toBe("entregado_garantia");
  });

  it("el movimiento deja claro que se decidió no devolverlo, no que no había cliente", () => {
    const db = dbCon({ customerId: "c1" });
    entregarGarantia(db, admin, { warrantyId: "w1", devolverABodega: true });
    const movimiento = db.movements.find((m) => m.unitId === "un1");
    expect(movimiento?.notes).toContain("se decide no devolverlo");
  });

  it("devolverABodega no afecta la resolución \"cambio\": el original se libera igual que siempre", () => {
    const db = dbCon({ customerId: "c1", resolucion: "cambio", productId: "p1" }, { status: "en_servicio_tecnico" as never });
    db.units.push({
      id: "un2", productId: "p1", serial: "999", condition: "nuevo", status: "en_bodega",
      receivedAt: now, createdBy: "u1",
    });
    entregarGarantia(db, admin, { warrantyId: "w1", replacementUnitId: "un2", devolverABodega: true });
    // El original entra a bodega (comportamiento de "cambio"), devolverABodega no aplica ahí.
    expect(db.units.find((u) => u.id === "un1")?.status).toBe("en_bodega");
  });
});

describe("registrarDiagnostico · resolución cambio pide el serial de reemplazo", () => {
  const reemplazo = (overrides: Partial<Unit> = {}): Unit => ({
    id: "un2", productId: "p1", serial: "999", condition: "nuevo", status: "en_bodega",
    receivedAt: now, createdBy: "u1", ...overrides,
  });

  it("sin serial de reemplazo, el diagnóstico de cambio se rechaza y el caso no cambia", () => {
    const db = dbCon({ productId: "p1", status: "en_servicio_tecnico" });
    expect(() =>
      registrarDiagnostico(db, admin, { warrantyId: "w1", diagnostico: "placa dañada", resolucion: "cambio" }),
    ).toThrow();
    expect(db.warranties[0].status).toBe("en_servicio_tecnico");
  });

  it("guarda el serial elegido y la entrega lo usa sin volver a pedirlo", () => {
    const db = dbCon({ productId: "p1", status: "en_servicio_tecnico" });
    db.units.push(reemplazo());
    registrarDiagnostico(db, admin, {
      warrantyId: "w1", diagnostico: "placa dañada", resolucion: "cambio", replacementUnitId: "un2",
    });
    expect(db.warranties[0].replacementUnitId).toBe("un2");
    entregarGarantia(db, admin, { warrantyId: "w1" });
    expect(db.units.find((u) => u.id === "un2")?.status).toBe("entregado_garantia");
    expect(db.units.find((u) => u.id === "un1")?.status).toBe("en_bodega");
  });

  it("garantía previa (sin producto ni unidad): acepta cualquier unidad disponible", () => {
    const db = dbCon({ unitId: undefined, productId: undefined, imeiManual: "123", status: "en_servicio_tecnico" });
    db.units = [reemplazo()];
    registrarDiagnostico(db, admin, {
      warrantyId: "w1", diagnostico: "no enciende", resolucion: "cambio", replacementUnitId: "un2",
    });
    entregarGarantia(db, admin, { warrantyId: "w1" });
    expect(db.warranties[0].status).toBe("entregado");
    expect(db.units[0].status).toBe("entregado_garantia");
  });

  it("caso previo que ya quedó en reenvío sin serial: se puede entregar eligiéndolo al entregar", () => {
    const db = dbCon({ unitId: undefined, productId: undefined, imeiManual: "123", resolucion: "cambio" });
    db.units = [reemplazo()];
    entregarGarantia(db, admin, { warrantyId: "w1", replacementUnitId: "un2" });
    expect(db.warranties[0].status).toBe("entregado");
  });

  it("con producto conocido, rechaza un reemplazo de otro producto", () => {
    const db = dbCon({ productId: "p1", status: "en_servicio_tecnico" });
    db.units.push(reemplazo({ productId: "p2" }));
    expect(() =>
      registrarDiagnostico(db, admin, {
        warrantyId: "w1", diagnostico: "x", resolucion: "cambio", replacementUnitId: "un2",
      }),
    ).toThrow();
  });
});

describe("entregarGarantia · garantía previa (cliente escrito a mano) no es falla de inventario", () => {
  it("garantiaTieneCliente: cliente registrado, pedido o cliente manual cuentan; vacío no", () => {
    expect(garantiaTieneCliente({ customerId: "c1" })).toBe(true);
    expect(garantiaTieneCliente({ orderId: "o1" })).toBe(true);
    expect(garantiaTieneCliente({ clienteManual: "Camilo Tamayo" })).toBe(true);
    expect(garantiaTieneCliente({ clienteManual: "   " })).toBe(false);
    expect(garantiaTieneCliente({})).toBe(false);
  });

  it("una previa reparada se entrega al cliente (no se registra como devuelta a bodega)", () => {
    const db = dbCon({
      unitId: undefined, productId: undefined, customerId: undefined, orderId: undefined,
      imeiManual: "352130211328637", clienteManual: "Camilo Tamayo",
      resolucion: "reparado",
    });
    entregarGarantia(db, admin, { warrantyId: "w1" });
    expect(db.warranties[0].status).toBe("entregado");
    const evento = db.warrantyEvents[db.warrantyEvents.length - 1];
    expect(evento?.notes).toBe("Entregado al cliente");
  });

  it("una falla de inventario (con unidad, sin cliente de ningún tipo) sí vuelve a bodega", () => {
    const db = dbCon({ customerId: undefined, orderId: undefined, clienteManual: undefined, resolucion: "reparado" });
    entregarGarantia(db, admin, { warrantyId: "w1" });
    expect(db.units.find((u) => u.id === "un1")?.status).toBe("en_bodega");
    expect(db.warrantyEvents[db.warrantyEvents.length - 1]?.notes).toBe("Reparado y devuelto a bodega");
  });
});

describe("entregarGarantia · cambio de equipo: el original entra a bodega y el reemplazo sale", () => {
  it("el original queda en bodega (vendible), sin pedido y con movimiento de entrada; el reemplazo sale", () => {
    const db = dbCon({ productId: "p1", resolucion: "cambio", customerId: "c1", orderId: "o1" });
    db.units.push({
      id: "un2", productId: "p1", serial: "999", condition: "nuevo", status: "en_bodega",
      receivedAt: now, createdBy: "u1",
    });
    db.orderItemUnits.push({ id: "x1", orderItemId: "i1", unitId: "un1", createdAt: now });

    entregarGarantia(db, admin, { warrantyId: "w1", replacementUnitId: "un2" });

    expect(db.units.find((u) => u.id === "un2")?.status).toBe("entregado_garantia");
    expect(db.units.find((u) => u.id === "un1")?.status).toBe("en_bodega");
    expect(db.orderItemUnits.some((row) => row.unitId === "un1")).toBe(false);
    const entrada = db.movements.find((m) => m.unitId === "un1" && m.type === "entrada");
    expect(entrada?.notes).toContain("Equipo original recibido en bodega");
  });
});

describe("deshacerEstadoGarantia · devolver un caso al estado anterior", () => {
  const conTecnico = () => {
    const db = dbCon({ productId: "p1", status: "recibido" });
    db.tecnicos = [{ id: "t1", nombre: "Andres", activo: true, createdAt: now }];
    return db;
  };

  it("de en servicio a recibido: quita el técnico y deja el rastro en el historial", () => {
    const db = conTecnico();
    enviarATecnico(db, admin, { warrantyIds: ["w1"], tecnicoId: "t1" });
    deshacerEstadoGarantia(db, admin, { warrantyId: "w1" });
    expect(db.warranties[0].status).toBe("recibido");
    expect(db.warranties[0].tecnicoId).toBeUndefined();
    const ultimo = db.warrantyEvents[db.warrantyEvents.length - 1];
    expect(ultimo.status).toBe("recibido");
    expect(ultimo.notes).toContain("Devuelto al estado anterior");
  });

  it("de reenvío (reparado) a en servicio: borra el diagnóstico y conserva el técnico", () => {
    const db = conTecnico();
    enviarATecnico(db, admin, { warrantyIds: ["w1"], tecnicoId: "t1" });
    registrarDiagnostico(db, admin, { warrantyId: "w1", diagnostico: "pantalla", resolucion: "reparado", costo: 50 });
    deshacerEstadoGarantia(db, admin, { warrantyId: "w1" });
    const w = db.warranties[0];
    expect(w.status).toBe("en_servicio_tecnico");
    expect(w.tecnicoId).toBe("t1");
    expect(w.diagnostico).toBeUndefined();
    expect(w.resolucion).toBeUndefined();
    expect(w.costo).toBeUndefined();
  });

  it("de reenvío (cambio) sin técnico vuelve a recibido y suelta el serial de reemplazo", () => {
    const db = dbCon({ productId: "p1", status: "recibido" });
    db.units.push({ id: "un2", productId: "p1", serial: "999", condition: "nuevo", status: "en_bodega", receivedAt: now, createdBy: "u1" });
    registrarDiagnostico(db, admin, { warrantyId: "w1", diagnostico: "x", resolucion: "cambio", replacementUnitId: "un2" });
    deshacerEstadoGarantia(db, admin, { warrantyId: "w1" });
    expect(db.warranties[0].status).toBe("recibido");
    expect(db.warranties[0].replacementUnitId).toBeUndefined();
    expect(db.units.find((u) => u.id === "un2")?.status).toBe("en_bodega");
  });

  it("no se deshace un diagnóstico que ya movió el inventario (sin falla / defectuoso)", () => {
    const db = dbCon({ productId: "p1", status: "en_servicio_tecnico" }, { status: "en_reparacion" });
    registrarDiagnostico(db, admin, { warrantyId: "w1", diagnostico: "ok", resolucion: "sin_falla" });
    expect(() => deshacerEstadoGarantia(db, admin, { warrantyId: "w1" })).toThrow();
    expect(db.warranties[0].status).toBe("reenvio_pendiente");
  });

  it("no se deshace un caso recibido, entregado ni devuelto", () => {
    for (const status of ["recibido", "entregado", "devuelto"] as const) {
      expect(estadoAnteriorGarantia({ status })).toBeNull();
    }
  });
});

