
export class RegistroNota {
    /**
     * @var string
     * Ejemplo: 910001M
     */
    codigo_materia: string;
    cancela_materia: boolean;
    /**
     * @var number
     */
    creditos: Number;
    /**
     * @var string
     * Ejemplos: ['2018/02/01', '2018-12-1']
     */
    fecha_cancelacion_materia: string;

    /**
     * @var string
     * Ejemplos: ['2018/02/01', '2018-12-1']
     */
    fecha_reactivacion_materia: string;
    /**
     * @var string
     */
    nombre_materia: string;

    grupo: string;
    /**
     * @var string
     * Ejemplos: ['4.5', '1,2', '5']
     */
    nota: string;
}