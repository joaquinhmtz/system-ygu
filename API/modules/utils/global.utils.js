let CountersScheme = require("./../models/counter.scheme");

function GetQueryPager (pager) {
    let pagerTmp = {
        limit: 10,
        skip: 1
    };

    if (pager.page) pagerTmp.skip = pager.page;
    if (pager.limit) pagerTmp.limit = pager.limit;

    return pagerTmp;
}

const CreateFolio = async (data) => {
    try {
        let endFolio = '';
        console.log("data**", data);
        let findCounter = await CountersScheme.findOne({ type : data.type });
  
        if (findCounter.counter <= 9) endFolio = "000" + findCounter.counter.toString();
        else if (findCounter.counter >= 10 && findCounter.counter <= 99) endFolio = "00" + findCounter.counter.toString();
        else if (findCounter.counter >= 100 && findCounter.counter <= 999) endFolio = "0" + findCounter.counter.toString();
        else if (findCounter.counter >= 1000) endFolio = findCounter.counter.toString();
  
        let updateFolio = await CountersScheme.updateOne({ _id : findCounter._id }, { $inc: { counter: 1 } });

        return endFolio;

    } catch (e) {
        console.log("Err CreateFolio: ", e);
        throw new Error(e);
    }
}

module.exports.GetQueryPager = GetQueryPager;
module.exports.CreateFolio = CreateFolio;