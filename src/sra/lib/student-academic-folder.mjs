import cheerio from "cheerio";
export function extractStudentResolution(html: any /* string */) {
    const $ = cheerio.load(html);
    return $('input[name="hia_rep_codigo"]').first().attr('value');
}

export function extractStudentPeriods(html: any /* string */): Cheerio{
    const $ = cheerio.load(html);
    const periodArray = $('input[name="DetalleCarpeta"]');
    return periodArray;
}

export function getPeriodList(periodArray: Cheerio): string[]{
    const periodList: string[] = [];
     periodArray.map((i, el)=>{
        periodList.push(el.attribs["value"]);
    }).get();
    return periodList;
}