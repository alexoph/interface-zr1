import { Kernel } from "../sra/kernel.mjs";
import { htmlToAcademicRegistries } from '../sra/lib/academic-history';
import { TipoBusquedaEstudianteEnum, StudentSearchInput, RegistrosHistorialAcademico } from "../models/index.mjs";
import { document_numbers } from "./docs_to_download.mjs";
import { codes } from "./codes_to_download.mjs";

import fs from 'fs';
// $FlowFixMe
import  ObjectsToCsv from 'objects-to-csv';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var appKernel = new Kernel("PHPSESSID=ff710d9d0115bf3ce361d5b1ed555ceb");


/**
 * Ejemplo de busqueda de un usuario


async function main() {
    var inputBusqueda = new StudentSearchInput();
    inputBusqueda.doc_number = "1085339336";
    inputBusqueda.nombres = "DANIEL DAVID";
    inputBusqueda.codigo_estudiante = "201010274";
    inputBusqueda.apellidos = "CARDONA HENAO";


    const results = await appKernel.getStudentService().searchStudents(inputBusqueda, TipoBusquedaEstudianteEnum.codigoCompleto);
    console.log(results[0]);
    const studentResolution = appKernel.getStudentService().getStudentAcademicHistory(results[0])
    .then((res: RegistrosHistorialAcademico) => {
       res.registros.forEach(r => console.log(r.notas));
       //console.log(res);
    }).catch(err => console.log(err));
}
 */

/*
consulta la información sra disponible en red basado en un array de numeros de documento

async function main() {
    const registries = await appKernel.getStudentService().getStudentAcademicHistories(document_numbers) ;
    const date = new Date();
    fs.writeFile(
        `./historicos-academicos-json/results-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.json`,
        JSON.stringify(registries),
        function(err) {
            if(err) {
                return console.log(err);
            }
        
            console.log("The file was saved!");
        });

    }
*/

function academic_history_object_to_semestral_rows(object: RegistrosHistorialAcademico) {
    const rows = [];
	const registro = {
        promedio_actual_acumulado: object.promedio_actual_acumulado,
        documento: object.documento,
        codigo_estudiante: object.codigo_estudiante,
        codigo_programa: object.codigo_programa,
        nombre_estudiante: object.nombre_estudiante,
        nombre_programa: object.nombre_programa,
        codigo_sede: object.codigo_sede
    };
    for(let semestre of object.registros) {
        let row = {...registro, ...semestre};
        delete row.notas;
        rows.push(row);
    }
    return rows;
}

function academic_history_object_to_rows(object: RegistrosHistorialAcademico) {
	const rows = [];
	const registro = {
        promedio_actual_acumulado: object.promedio_actual_acumulado,
        documento: object.documento,
        codigo_estudiante: object.codigo_estudiante,
        codigo_programa: object.codigo_programa,
        nombre_estudiante: object.nombre_estudiante,
        nombre_programa: object.nombre_programa,
        codigo_sede: object.codigo_sede
	};
	for(let semestre of object.registros) {
		let row = {...registro, ...semestre};
		for(let nota of semestre.notas) {
			row = {...row, ...nota};
			delete row.notas;
			rows.push(row);
		}
	}
	return rows;
}
/*

Extrae informacion de los archivos descargados y los guarda en un json



async function main() {
    const baseDir = './historicos-academicos/';
    const academicStoryFiles = fs.readdirSync(baseDir);
    var failed = 0;
    var processed = 0;
    var registries = [];
    academicStoryFiles.forEach(fileName => {
        const html = fs.readFileSync(`${baseDir}${fileName}`, 'utf8');
        try {
            let registry = htmlToAcademicRegistries(html);
            registries.push(registry);
            processed++;
            console.log(`Porcentaje terminado: ${processed*100/academicStoryFiles.length}`)
        } catch( err ){
            failed++;
        }
    })
    const date = new Date();
    fs.writeFile(
        `./historicos-academicos-json/results-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.json`,
        JSON.stringify(registries),
        function(err) {
            if(err) {
                return console.log(err);
            }
        
            console.log("The file was saved!");
        });
    console.log(failed);

}
*/
/*
Extrae información de el json y la guarda detallada por nota
*/
/*
function main() {
    const registriesContent = fs.readFileSync('./historicos-academicos-json/results-2019-4-31-17-56-4.json', 'utf8');
    const registries = JSON.parse(registriesContent);

    var rows = [];
    registries.forEach(registry => {
        rows = rows.concat(academic_history_object_to_rows(registry));
    });
    console.log(rows[0]);
    new ObjectsToCsv(rows).toDisk('./csv-files/academic-histories.csv');
}
*/
/*
Extrae información de el json y la guarda detallada por semestre (sin notas)
*/
/*
function main() {
    const registriesContent = fs.readFileSync('./historicos-academicos-json/results-2019-4-31-17-56-4.json', 'utf8');
    const registries = JSON.parse(registriesContent);
    var rows = [];
    registries.forEach(registry => {
        rows = rows.concat(academic_history_object_to_semestral_rows(registry));
    });
    console.log(rows[0]);
    new ObjectsToCsv(rows).toDisk('./csv-files/student-semesters.csv');
}
*/
/**
 * Extrae la información de un json y reinicia la busqueda en los html locales


 function main() {
    const registriesContent = fs.readFileSync('./historicos-academicos-json/results-2019-4-31-15-24-27.json', 'utf8');
    const registries: Array<RegistrosHistorialAcademico> = JSON.parse(registriesContent);
    var processed = 0;
    var failed = 0;
    var correctedRegistries  = [];
    for(const registry of registries) {
        try {
        const fileContent  = fs.readFileSync(`./historicos-academicos/${registry.codigo_estudiante}-${registry.codigo_programa}.html`, 'utf8');
        correctedRegistries.push(htmlToAcademicRegistries(fileContent));
        processed++;
        } catch(err ){
            failed ++;
        }
        console.log("Porcentaje terminado: " + (processed*100/registries.length));
    }
    let date = new Date();
    fs.writeFile(
        `./historicos-academicos-json/results-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.json`,
        JSON.stringify(registries),
        function(err) {
            if(err) {
                return console.log(err);
            }
        
            console.log("The file was saved!");
        });

 }
 */


/**
 * Descarga la información desde el sra y la guarda en un csv por notas
 */
async function main() {
    
    const registries: Array<RegistrosHistorialAcademico> = [];
     for(let code of codes ) {
         let input = new StudentSearchInput();
         let failedCodes = [];
         input.codigo_estudiante = String(code);
         var searchResult = await appKernel.studentService.searchStudent(input, TipoBusquedaEstudianteEnum.codigoCompleto);
        console.log(searchResult, 'search result', code, "code");
        if(searchResult.length===0) {
            console.error(`El estudiante con código ${code} no se ha encontrado`);
            failedCodes.push(code);
        } else {
            var academicHistory = await appKernel.studentService.getStudentAcademicHistory(searchResult[0]);
            registries.push(academicHistory);
        }
        console.log(failedCodes, 'failed codes');

    }
    var rows = [];
    registries.forEach(registry => {
        rows = rows.concat(academic_history_object_to_rows(registry));
    });
    console.log(rows[0]);
    new ObjectsToCsv(rows).toDisk('./csv-files/academic-histories.csv');
}


// async function main() {
//     const registries = await appKernel.getStudentService().getStudentAcademicHistories(document_numbers) ;
//     const date = new Date();
//     fs.writeFile(
//         `./historicos-academicos-json/results-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.json`,
//         JSON.stringify(registries),
//         function(err) {
//             if(err) {
//                 return console.log(err);
//             }
        
//             console.log("The file was saved!");
//         });

//     }


main();
