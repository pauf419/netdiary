module.exports = class SubjectDto {
    id 
    title 
    description 
    banner

    constructor(model) {
        this.id = model.id 
        this.title = model.title 
        this.description = model.description 
        this.banner = process.env.STATIC_URL+model.banner
    }
}
