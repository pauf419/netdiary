
module.exports = class RegsessionDto {
    id;
    email;

    constructor(model) {
        this.id = model.id;
        this.email = model.email
    }
}
