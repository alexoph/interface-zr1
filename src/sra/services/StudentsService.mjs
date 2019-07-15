import { 
    StudentSearchInput,
    Estudiante,
    RegistrosHistorialAcademico
} from '../../models/index.mjs';

import qs from 'qs';
import fs from 'fs';
import { getSearchPatron, extractStudentsResults } from "../lib/search-student.mjs";
import type { ApiServiceInterface } from './ApiService.mjs';
import type { TipoBusquedaEstudianteType } from '../../models/index.mjs';
import type { AxiosPromise } from 'axios';
import { extractStudentResolution } from "../lib/student-academic-folder.mjs";
import { htmlToAcademicRegistries } from "../lib/academic-history.mjs";
export interface StudentsServiceInterface {
    apiService: ApiServiceInterface;
    getStudentPeriods(student: Estudiante): Promise<Date[]>;
    getStudentAcademicHistory(student: Estudiante, period?: string, saveHtmlFiles?:boolean): Promise <RegistrosHistorialAcademico>;
    getStudentResolution(student: Estudiante):  Promise<string>;
    searchStudent(
        input: StudentSearchInput,
        method?: TipoBusquedaEstudianteType ): Promise<Estudiante[]>;
}
class PostForStudentFolder {
    deu_est_per_codigo: string;
    codigo_estudiante: string;
    wincombomep_codigo_estudiante: string;
    modulo: string;
    accion: string;

    constructor(input: {
        studentName: string,
        studentLastName: string,
        personCode: string,
        program_code: string,
        sedCode: string, // ej. 00 (CALI)
        studentCode: string,
        jornada: string // ej. DIU, NOC
    }) {
        this.deu_est_per_codigo = input.personCode;;
        this.codigo_estudiante = input.studentCode;
        this.wincombomep_codigo_estudiante = this
        .generate_wincombomep_codigo_estudiante(
            input.studentName,
            input.program_code,
            input.sedCode,
            input.jornada,
            input.studentLastName);
        this.modulo = 'Academica';
        this.accion = 'Consultar Estudiante';
    }
    generate_wincombomep_codigo_estudiante(
        studentName: string,
        programCode: string,
        sedCode: string,
        jornada: string,
        studentLastName: string
        ): string {
        return `${studentName}  ${studentLastName} -> ${programCode}-${sedCode}-${jornada}`;
    }
}


class PostForAcademicHistoryDetail {
    accion;
    DetalleCarpeta;
    /**
     * Codigo de estudiante con prefijo, ej: 201327958
     * @var hia_est_codigo integer
     */
    hia_est_codigo;
    /**
     * Codigo de jornada, valores posibles: DIU, NOC, VES
     * @var string hia_jor_codigo
     */
    hia_jor_codigo;

    /**
     * Codigo de programa, ej: 3745
     * @var integer
     */
    hia_pra_codigo;
    /**
     * Codigo de persona, tabla de el SRA
     * @var number
     */
    hia_per_codigo;


    /**
     * @var integer
     */
    hia_rep_codigo;
    /**
     * Codigo de la sede, ej: '00' (para Cali)
     * @var string
     */
    hia_sed_codigo;
    /**
     * Modulo de consulta, valores conocidos: 'Academica'
     * @var string
     */
    modulo;
    /**
     * Tipo de carpeta a generar
     * Valores posibles: 'BASICA', 'COMPLETA', la básica no muestra las materias canceladas
     * @var string
     */
    TipoCarpeta;

    Ventana;
    versionImprimible;
    constructor(hia_est_codigo, hia_per_codigo, hia_pra_codigo, hia_sed_codigo, hia_rep_codigo, tipo_carpeta = 'COMPLETA', hia_jor_codigo='DIU')
    {
        this.accion = 'mostrarDetalleUnaCarpeta';
        this.hia_est_codigo = hia_est_codigo;
        this.hia_pra_codigo = hia_pra_codigo;
        this.hia_per_codigo = hia_per_codigo;
        this.hia_rep_codigo = hia_rep_codigo;
        this.hia_sed_codigo = hia_sed_codigo;
        this.modulo = 'Academica';
        this.Ventana = '';
        this.versionImprimible= '';
        this.DetalleCarpeta = 'COMPLETA';
        this.TipoCarpeta = tipo_carpeta;
        this.hia_jor_codigo = hia_jor_codigo;
    }
    get_url_query() {
        return qs.stringify(this)+'&accion=Generar Carpeta';
    }

}




class PostForAcademicHistoryFolder {
     accion: string;
     DetalleCarpeta: string;
    /**
     * Codigo de estudiante con prefijo, ej: 201327958
     * @var hia_est_codigo integer
     */
     hia_est_codigo: string;
    /**
     * Codigo de jornada, valores posibles: DIU, NOC, VES
     * @var string hia_jor_codigo
     */
     hia_jor_codigo: string;

    /**
     * Codigo de programa, ej: 3745
     * @var integer
     */
     hia_pra_codigo: string;
    /**
     * Codigo de persona, tabla de el SRA
     * @var number
     */
     hia_per_codigo: string;

    /**
     * @var integer
     */
     hia_rep_codigo: string;
    /**
     * Codigo de la sede, ej: '00' (para Cali)
     * @var string
     */
     hia_sed_codigo: string;
    /**
     * Modulo de consulta, valores conocidos: 'Academica'
     * @var string
     */
     modulo: string;
    /**
     * Tipo de carpeta a generar
     * Valores posibles: 'BASICA', 'COMPLETA', la básica no muestra las materias canceladas
     * @var string
     */
     TipoCarpeta: string;

     Ventana: string;
     versionImprimible: string;


     constructor(input: {
         hia_est_codigo: string, hia_per_codigo: string,
          hia_pra_codigo: string, hia_sed_codigo: string, 
          hia_rep_codigo: string, tipo_carpeta?: string, hia_jor_codigo: string, detalleCarpeta?: string})
     {

         this.accion = 'mostrarDetalleUnaCarpeta';
         this.hia_est_codigo = input.hia_est_codigo;
         this.hia_pra_codigo = input.hia_pra_codigo;
         this.hia_per_codigo = input.hia_per_codigo;
         this.hia_rep_codigo = input.hia_rep_codigo;
         this.hia_sed_codigo = input.hia_sed_codigo;
         this.modulo = 'Academica';
         this.Ventana = '';
         this.versionImprimible= '';
         this.DetalleCarpeta = input.detalleCarpeta? input.detalleCarpeta : 'COMPLETA';
         this.TipoCarpeta = input.tipo_carpeta? input.tipo_carpeta: 'COMPLETA';
         this.hia_jor_codigo = input.hia_jor_codigo? input.hia_jor_codigo: 'DIU';
     }
}
function studentToPostForStudentFolder(student: Estudiante): PostForStudentFolder{
    const data = new PostForStudentFolder({
        studentCode: student.codigo_estudiante,
        sedCode: student.codigo_sede,
        personCode: student.codigo_persona,
        studentName: student.nombre,
        studentLastName: student.apellidos,
        jornada: student.jornada,
        program_code: student.codigo_programa,
    });

    return data;
}

export class StudentsService implements StudentsServiceInterface{
    apiService: ApiServiceInterface;
    async searchStudent(input: StudentSearchInput, method?: TipoBusquedaEstudianteType ): Promise<Estudiante[]> {
        let arr: Array<Estudiante> = [];
        let url = 'paquetes/herramientas/wincombo.php';
        const patron = getSearchPatron(input, method);
        const params = { opcion: 'estudianteConsulta', variableCalculada: 0, patron  }
     
        const response = await this.apiService.get(url, params);
        const results = extractStudentsResults(response);
        return results;
    }
    async getStudentAcademicHistory(student: Estudiante, period?: string, saveHtmlFiles:boolean = true): Promise <RegistrosHistorialAcademico> {
        let url = '/paquetes/academica/index.php';
        if(student.codigo_resolucion === undefined || student.codigo_resolucion === '' ) {
            student.codigo_resolucion = await this.getStudentResolution(student);
        }
        const data = new PostForAcademicHistoryDetail(
            student.codigo_estudiante,
            student.codigo_persona,
            student.codigo_programa,
            student.codigo_sede,
            student.codigo_resolucion
        );
        const html = await this.apiService.post(url, data.get_url_query());
   
        if(saveHtmlFiles) {
            // $FlowFixMe
            fs.writeFile(
                `./historicos-academicos/${student.codigo_estudiante}-${student.codigo_programa}.html`,
                html,
                function(err) {
                    if(err) {
                        return console.log(err);
                    }
                
                    console.log("The file was saved!");
                });
        } 
        const academicHistory = htmlToAcademicRegistries(html);
        academicHistory.codigo_estudiante = student.codigo_estudiante;
        return academicHistory;
    }

    async getStudentPeriods(student: Estudiante): Promise<Date[]>{
        let url = '/paquetes/academica/index.php';
        const data = studentToPostForStudentFolder(student);
        const urlData = qs.stringify(data);
        const html = await this.apiService.post(url, urlData);
        
    }

    async getStudentResolution(student: Estudiante): Promise<string> {
        let url = '/paquetes/academica/index.php';
        const data = studentToPostForStudentFolder(student);
        const urlData =  qs.stringify(data);
        const html = await this.apiService.post(url, urlData);
        const studentResolution =  extractStudentResolution(html);
        return studentResolution;
    }

    constructor(apiService: ApiServiceInterface) {
        this.apiService = apiService;
    }
}

