import {
    Estudiante,
    StudentSearchInput,
    TipoBusquedaEstudianteEnum
} from "../../models/index.mjs";
import type { TipoBusquedaEstudianteType }  from "../../models/index.mjs";
import { printElement } from "./cheerio.mjs";
import cheerio  from "cheerio";

function extractStudentsResultTrs($: CheerioStatic): Cheerio {
    return $('table').first().find('tbody > tr[bgcolor="#CCCCCC"],tr[bgcolor="#FFFFFF"]')
}

function extractStudentResultFromTr(el: CheerioElement): Estudiante {
    
    const resultado = new Estudiante();
    const $ = cheerio.load(el);
    const aLinks = $('td > a');
    resultado.apellidos = aLinks.get(4).firstChild.data;
    resultado.codigo_persona = aLinks.get(0).firstChild.data;
    resultado.codigo_estudiante = aLinks.get(1).firstChild.data;
    const tipoDocumento_documento = aLinks.get(2).firstChild.data.split(' ');
    resultado.tipo_documento = tipoDocumento_documento[0];
    resultado.documento = tipoDocumento_documento[1];
    resultado.nombre = aLinks.get(3).firstChild.data;
    const programa_sede_jornada = aLinks.get(5).firstChild.data.split('-');
    resultado.codigo_programa = programa_sede_jornada[0];
    resultado.codigo_sede = programa_sede_jornada[1];
    resultado.jornada = programa_sede_jornada[2];
    return resultado;
}
/**
 * Seleccione el estudiante del cuál desea ver la Carpeta Académica. Puede hacerlo de tres (3) formas:
   Digite el código completo del estudiante (incluyendo la centuria, es decir con los nueve dígitos), y luego haga la búsqueda del mismo, haciendo clic sobre el botón . Seleccione el estudiante de interés; luego haga clic en el botón: Consultar Estudiante
   Digite los apellidos del estudiante, y luego haga la búsqueda del mismo, haciendo clic sobre el botón . Seleccione el estudiante de interés; luego haga clic en el botón: Consultar Estudiante
   Digite los apellidos del estudiante y el nombre, usando entre ellos un guión ( - ), Ejemplo: Quintero-Carlos , y luego haga la búsqueda del mismo, haciendo clic sobre el botón . Seleccione el estudiante de interés; luego haga clic en el botón: Consultar Estudiante
 */
export function getSearchPatron(input: StudentSearchInput, method?: TipoBusquedaEstudianteType ) : string|typeof undefined  {
    if(method === undefined) {
        method = TipoBusquedaEstudianteEnum.documento;
    }
    switch (method) {
        case TipoBusquedaEstudianteEnum.apellidos: 
        return input.apellidos;
        case TipoBusquedaEstudianteEnum.apellidos_nombres:
        return `${input.apellidos? input.apellidos: ''}-${input.nombres? input.nombres: ''}`;
        case TipoBusquedaEstudianteEnum.documento:
        return input.doc_number;
        case TipoBusquedaEstudianteEnum.codigoCompleto:
        return input.codigo_estudiante;
        default: 
        return '';
    }
}


export function extractStudentsResults(html: any /** string */): Estudiante[] {
  
    var results: Estudiante[] = [];
    var $ = cheerio.load(html);
    const trs = extractStudentsResultTrs($);
  
    trs.map((index, el: CheerioElement) => {
        results.push(extractStudentResultFromTr(el));
    }
    );
    return results;
}