// $FlowFixMe
import chai from "chai" ;
const expect = chai.expect;

declare var before: any;
declare var describe: any;
declare var it: any;

import { cookie } from "../cookie.mjs";

import { 
    type KernelInterface,
    Kernel as SRAKernel} from "../../sra/kernel.mjs";
import {
    RegistrosHistorialAcademico
} from "../../models";
const sraKernel = new SRAKernel(cookie);

describe("Academic history", function() {
    var history = new RegistrosHistorialAcademico();
    
    var lizeth_201929364: any /* Estudiante */;
    before(async () => {
        // $FlowFixMe
        lizeth_201929364 = {
            apellidos: 'PARRA ORLAS',
            codigo_persona: '2000169674',
            codigo_estudiante: '201929364',
            tipo_documento: 'C.C.',
            documento: '1144104343',
            nombre: 'LIZETH CAROLINA',
            codigo_programa: '3660',
            codigo_sede: '00',
            jornada: 'DIU' }
        history =  await sraKernel.studentService.getStudentAcademicHistory(lizeth_201929364);
    })
    it("LIZETH<201929364> academic history diferent of undefined", async () =>  {
        expect(history).not.eq(undefined);
    })
    it("LIZETH<201929364> academic history contains \"MAYO/2019 - SEPTIEMBRE/2019\" period", async () =>  {
        const registries = history.registros;
        const periodNames = registries.map(registry => registry.nombre_periodo);
        expect(periodNames).to.have.members(["MAYO/2019 - SEPTIEMBRE/2019"]);
    })
    it("LIZETH<201929364> MAYO/2019 - SEPTIEMBRE/2019 semester have '111069M' and '204355M' sujects", async () => {
        const registries = history.registros;
        const may2019tosep2019Period = registries.find(registry => registry.nombre_periodo = "MAYO/2019 - SEPTIEMBRE/2019");
        expect(may2019tosep2019Period).to.not.eq(undefined);
        if(may2019tosep2019Period === undefined) {
            return;
        }
        const subjectCodes = may2019tosep2019Period.notas.map(grade => grade.codigo_materia);
        expect(subjectCodes).to.contain.members(['111069M', '204355M']);
    })
})