import { RegistroHistorialAcademico } from "./RegistroHistorialAcademico.mjs";

export class RegistrosHistorialAcademico {

    promedio_actual_acumulado: string;
    /**
     * @var array Array de RegistroHistorialAcademico
     */
    registros: Array<RegistroHistorialAcademico>;
    documento: string;
    codigo_programa: string;
    nombre_programa: string;
    codigo_sede: string;
    codigo_estudiante: string;
    documento_estudiante: string;
    programa_estudiante: string;
    nombre_estudiante: string;
    constructor() {
        this.registros = [];
    }
}