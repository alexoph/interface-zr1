
import chai from "chai" ;
import cheerio from "cheerio";

import { folder1 } from "../../sra/mocks/student-folder.mjs";

import { extractStudentPeriods, getPeriodList} from "../../sra/lib/student-academic-folder.mjs";


const expect = chai.expect;

declare var before: any;
declare var describe: any;
declare var it: any;

describe('TEST student-academic-folder', function(){
    it('extractStudentPeriods', ()=>{
        const inputs = extractStudentPeriods(folder1);
        // $FlowFixMe
        console.log(cheerio.html(inputs));
        expect(inputs.length).to.be.equal(14);
    })
    it('getPeriodList', ()=>{
        const inputs = extractStudentPeriods(folder1);
        const list = getPeriodList(inputs);
        console.log(list);
    })
})