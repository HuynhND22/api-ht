export const convertToSimpleString = (str: string) => {
    return str.replace(/\s/g, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}