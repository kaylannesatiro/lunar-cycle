export const unificarEFormatarTags = (tagsCustom = [], tagsSistema = []) => {
    return [...new Set([
        ...tagsCustom, 
        ...tagsSistema
    ])]
}