export const convertToUpperCaseString = (str: string): string => {
   let simpleString = str.replace(/đ/g, 'd').replace(/Đ/g, 'D');
    simpleString = simpleString.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return simpleString.replace(/\s+/g, ' ').trim().toUpperCase();
}