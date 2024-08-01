let BankScheme = require("./../models/bank.scheme");

const GetBank = async (data) => {
    try {
        let bank = await BankScheme.findOne(data);

        return bank;

    } catch (e) {
        console.log("Err GetBank: ", e);
        throw new Error(e);
    }
}

const SaveBank = async (data) => {
    try {
        let bank = new BankScheme(data);
        let save = await bank.save();

        return save;

    } catch (e) {
        console.log("Err SaveBank: ", e);
        throw new Error(e);
    }
}

module.exports.GetBank = GetBank;
module.exports.SaveBank = SaveBank;