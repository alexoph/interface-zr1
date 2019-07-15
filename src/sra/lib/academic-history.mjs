import { RegistrosHistorialAcademico } from "../../models/RegistrosHistorialAcademico.mjs";
import { RegistroHistorialAcademico } from "../../models/RegistroHistorialAcademico.mjs";
import cheerio  from "cheerio";
import { RegistroNota } from "../../models/RegistroNota.mjs";
function getPeriodTables($: CheerioStatic): Cheerio {
    return $('table[width="95%"]table[cellspacing="1"]table[align="center"]');
}

function getStudentInfoList($: CheerioStatic): Cheerio {
    return $('img[src*="ico_personal.gif"]')
    .parent()
    .parent()
    .find('b');

}


function extractStudentInfo($: CheerioStatic, registros: RegistrosHistorialAcademico) {
    const infoList = getStudentInfoList($);
    const documentTypeAndDocumentNumber = infoList.get(1).firstChild.data.split(' '); // C.C 1058847077
    const [_, document] = documentTypeAndDocumentNumber;
    registros.documento = document;
    const programCodeAndSedCodeAndStudyTimeAndProgramName = infoList.get(2).firstChild.data.split('-') // 3746-00-DIU-MATEMATICAS
    const [programCode, sedCode, __, programName] = programCodeAndSedCodeAndStudyTimeAndProgramName;
    registros.codigo_programa = programCode;
    registros.codigo_sede = sedCode;
    registros.nombre_programa = programName.trim();
    const studentCodeAndStudentName = infoList.get(0).firstChild.data.split(' -- ');// 201522006 -- ARTEAGA ESTACIO GUSTAVO ADOLFO 
    const [studentCode, studentName] = studentCodeAndStudentName;
    registros.nombre_estudiante = studentName.trim();
    registros.codigo_estudiante = studentCode.trim();
}
/**
 * 
 */
function extractGradeRegistry(el: CheerioElement) : any {
    if(! (el && el.childNodes) ) {
        return
    } else {
        const grade = new RegistroNota();
        const codigo = el.childNodes[1].firstChild.data;

        if(codigo) {
            grade.codigo_materia = codigo.trim();
        }
        const grupo = el.childNodes[3].firstChild?  el.childNodes[3].firstChild.data: '';
        if (grupo) {
            grade.grupo = grupo.trim();
        }
        const nombre = el.childNodes[5].firstChild.data;
        const nota = el.childNodes[9].firstChild.data;
        grade.nota = nota? nota.trim(): '';
        const fechaCancela = el.childNodes[19].firstChild? el.childNodes[19].firstChild.data: '';
        const fechaReactiva = el.childNodes[21].firstChild? el.childNodes[21].firstChild.data: '';
        grade.nombre_materia = nombre? nombre.trim(): '';
      
        grade.fecha_reactivacion_materia = fechaReactiva? fechaReactiva.trim(): '';
        grade.fecha_cancelacion_materia = fechaCancela? fechaCancela.trim() : '';
        grade.cancela_materia = grade.fecha_cancelacion_materia !== "" && grade.fecha_reactivacion_materia == "";
        return grade;
    }
}


function extractPeriodTrGrades($: CheerioStatic): Array<Object> {
    const trs = $('tr');
   
    var elements: Array<CheerioElement> = [];
    trs.each((index, tr) => {
        if(tr && tr.childNodes[1] &&  tr.childNodes.length === 23 ) {
            const nombreAsignatura = tr.childNodes[5].firstChild.data;
            if ( nombreAsignatura && nombreAsignatura.trim() !== "ASIGNATURA") {
                elements.push(tr);
            }
        }
    });
    return elements;
}
function extractGrades($: CheerioStatic): Array<RegistroNota> {

    const grades: Array<RegistroNota> = [];
    const trGrades = extractPeriodTrGrades($);
    for(let trGrade of trGrades) {
        let grade = extractGradeRegistry(trGrade);
        grades.push(grade);
    }
    return grades;
}
function extractPeriodNameFromTable($: CheerioStatic): string {
    const periodText =  $('td').first().text().trim();
    return periodText.replace('PERIODO: ', '');
}
function isLowAcademicPerformancePeriod($: CheerioStatic): bool {
    const title = "Bajos Rendimientos";
    const inputs = $('form').find(`input[title*="${title}"]`);
    return inputs.length>0
}

function hasStimulusPeriod($: CheerioStatic): bool {
    const value = "detalleEstimulos";
    const inputs = $('form').find(`input[value="${value}"]`);
    return inputs.length>0
}
function getPeriodAverage($: CheerioStatic): string {
    const tdGrade = $('tr').find('td').find('font').last();
    return tdGrade.text();
}
function extractCancelPeriodNameFromTable($: CheerioStatic): boolean {
    return false;
}
function isCanceledSemester($: CheerioStatic): bool {
    let isCanceled = false;
    $('td').each((index, td) => {
        const tdData = (td.firstChild? td.firstChild.data: '');
        if(tdData && tdData.trim().includes("Fecha Cancelaci")) {
            isCanceled = true;
        }
        // sad way to return false if the semester was canceled but also was reenabled
        if(tdData && tdData.trim().includes("Fecha Reactivac")) {
            isCanceled = false;
        }
    });
    return isCanceled;
}
function getCancelPeriodDate($: CheerioStatic): string {
   
    let cancelDate = $('tr').get(1).childNodes[7];
    if (!cancelDate || !cancelDate.childNodes || !cancelDate.childNodes[0]){
        return '';
    }
    return cancelDate.childNodes[0].data;
   
}
function periodTableToAcademicRegistry(el: CheerioElement): RegistroHistorialAcademico {
    const $ = cheerio.load(el);
    const registro = new RegistroHistorialAcademico();
    registro.nombre_periodo = extractPeriodNameFromTable($);
    registro.bajo_academico = isLowAcademicPerformancePeriod($);
    registro.estimulo_academico = hasStimulusPeriod($);
    const grades = extractGrades($);
    registro.promedio = getPeriodAverage($);
    registro.notas = grades;
    registro.cancelo_semestre = isCanceledSemester($); 
    let cancelperiodDate =  getCancelPeriodDate($);
    registro.fecha_cancelacion_semestre = cancelperiodDate;
    return registro;
}

function getTotalAverage($: CheerioStatic): string {
    return $('.error').find('font').find('b').text();
}

export  function htmlToAcademicRegistries(html: any /** string */): RegistrosHistorialAcademico {
    const historialAcademico = new RegistrosHistorialAcademico();
    var $ = cheerio.load(html);
    const periodTables = getPeriodTables($);
    historialAcademico.promedio_actual_acumulado = getTotalAverage($);
   
    periodTables.each((key: number, table)=> {
        let registro = periodTableToAcademicRegistry(table);
        historialAcademico.registros.push(registro);
    });
    extractStudentInfo($, historialAcademico);
    return historialAcademico;
}