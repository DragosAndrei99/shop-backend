export const formatJSONResponse = (response: Object, statusCode: number) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(response)
  }
}
