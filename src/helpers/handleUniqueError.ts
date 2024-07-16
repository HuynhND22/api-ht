export const handleUniqueError = (error: any) => {
    const regex = /The duplicate key value is \((.*?)\)/;
    let message = error.originalError.message.match(regex);
    message[1] = '[' + message[1] + ']' + ' already exists'
    return message;
}