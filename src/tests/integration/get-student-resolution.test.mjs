// $FlowFixMe
import chai from "chai" ;
const expect = chai.expect;

declare var describe: any;
declare var it: any;
declare var before: any;

import { cookie } from "../cookie.mjs";

import { 
    type KernelInterface,
    Kernel as SRAKernel} from "../../sra/kernel.mjs";

import {
    Estudiante
} from "../../models";

const sraKernel = new SRAKernel(cookie);
describe("Student resolution", function () {
    var lizeth_201929364: Estudiante;
    before(()=> {
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
    })
    it("LIZETH<201929364> RESOLUTION", async () => {
        const resolution = await sraKernel.studentService.getStudentResolution(lizeth_201929364);
        expect(resolution).to.be.eq("498");
    })
})
