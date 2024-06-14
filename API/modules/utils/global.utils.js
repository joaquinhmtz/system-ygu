function GetQueryPager (pager) {
    let pagerTmp = {
        limit: 10,
        skip: 1
    };

    if (pager.page) pagerTmp.skip = pager.page;
    if (pager.limit) pagerTmp.limit = pager.limit;

    return pagerTmp;
}

module.exports.GetQueryPager = GetQueryPager;