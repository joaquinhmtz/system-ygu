const AccountScheme = require("./../models/account.scheme");

const SaveAccount = async (data) => {
    let account = await AccountScheme.register(
        new AccountScheme({ userId: data.userId, username: data.username }),
        data.password
    );

    return account;
}

const RemoveAccount = async (data) => {
    let account = AccountScheme.remove({ userId: data._id }, function(err, result) {
        if(err) throw new Error(e);

        return (true);
    });
}

module.exports.SaveAccount = SaveAccount;
module.exports.RemoveAccount = RemoveAccount;