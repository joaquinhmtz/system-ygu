const AccountScheme = require("./../models/account.scheme");

const SaveAccount = async (data) => {
    console.log("SaveAccount***", data);
    let account = await AccountScheme.register(
        new AccountScheme({ userId: data.userId, username: data.username }),
        data.password
    );

    return account;
}

module.exports.SaveAccount = SaveAccount;