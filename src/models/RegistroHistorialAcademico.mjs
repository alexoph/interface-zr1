import { RegistroNota }  from "./RegistroNota.mjs";
export class RegistroHistorialAcademico {

    cancelo_semestre: boolean;
    fecha_cancelacion_semestre: string;
    /**
     * Ejemplo: PERIODO: AGOSTO/2010 - DICIEMBRE/2010
     * @var string
     */
    nombre_periodo: string;

    /**
     * @var string
     */
    numero_documento: string;

    /**
     * @var string
     */
    codigo_programa_univalle: string;
    /**
     * @var $promedio string
     */
    promedio: string;
    /**
     * @var array Array de RegistroNota
     */
    notas: Array<RegistroNota>;
    /**
     * @var bool
     */
    bajo_academico: boolean;
    /**
     * @var bool
     */
    estimulo_academico: boolean;
    /**
     * @var integer
     */
    puesto_estimulo: number;


}