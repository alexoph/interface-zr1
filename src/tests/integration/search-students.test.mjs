// $FlowFixMe
import chai from "chai" ;
const expect = chai.expect;

declare var describe: any;
declare var it: any;

import { cookie } from "../cookie.mjs";
import { 
    type KernelInterface,
    Kernel as SRAKernel} from "../../sra/kernel.mjs";
import { 
    TipoBusquedaEstudianteEnum,
    StudentSearchInput
} from '../../models';

const sraKernel = new SRAKernel(cookie);

describe("Student search", function () {
    it('check search by last name', async () => {
        let input = new StudentSearchInput();
        input.apellidos = "CARDENAS TRUJILLO";
        var searchResult = await sraKernel.studentService.searchStudent(input, TipoBusquedaEstudianteEnum.apellidos);;
        expect(searchResult.length).to.be.gt(0);
        expect(searchResult[0].apellidos).to.be.equal(input.apellidos);
    });
    it('check search by full name', async () => {
        let input = new StudentSearchInput();
        input.apellidos = "PARRA ORLAS";
        input.nombres = "LIZETH CAROLINA";
        
        var searchResult = await sraKernel.studentService.searchStudent(input, TipoBusquedaEstudianteEnum.apellidos_nombres);;
        expect(searchResult.length).to.be.gt(0);
        expect(searchResult[0].apellidos).to.be.equal(input.apellidos);
        expect(searchResult[0].nombre).to.be.equal(input.nombres);
    });
    it('check search by document number', async () => {
        let input = new StudentSearchInput();
        input.doc_number = "1144209113"; // NORALBA CARDENAS CORREA
        var searchResult = await sraKernel.studentService.searchStudent(input, TipoBusquedaEstudianteEnum.documento);;
        expect(searchResult.length).to.be.gt(0);
        expect(searchResult[0].apellidos).to.be.equal("CARDENAS CORREA");
        expect(searchResult[0].nombre).to.be.equal("NORALBA");
    });
    it('check search by student code', async () => {
        let input = new StudentSearchInput();
        input.codigo_estudiante = "201880026"; // NORALBA CARDENAS CORREA
        var searchResult = await sraKernel.studentService.searchStudent(input, TipoBusquedaEstudianteEnum.codigoCompleto);;
        expect(searchResult.length).to.be.gt(0);
        expect(searchResult[0].apellidos).to.be.equal("CARDENAS CORREA");
        expect(searchResult[0].nombre).to.be.equal("NORALBA");
    });
})

