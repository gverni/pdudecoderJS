function decode (inputVector, decodeVector, decodeHash) {
  var resultStr = ''
  console.log('Length of input vector:' + String(inputVector.length))
  console.log('Length of decode vector: ' + String(decodeVector.length))
  if (inputVector.length > decodeVector.length) {
    console.log('Warning: decoding array shorter than input vector. Leftmost bits of input array will not be decoded')
    decodeVector = Array(inputVector.length-decodeVector.length).fill(0).concat(decodeVector)
  } else if (inputVector.length < decodeVector.length) {
    console.log('Warning: input vector shorter than decoding array. Padding the leftmost bits to 0')
    inputVector = Array(decodeVector.length - inputVector.length).fill(0).concat(inputVector)
  }

  var arrayIndex = 0
  var decodeFunctionID = 0
  var numBits = 0
  var value = 0
  while (arrayIndex < inputVector.length) {
    decodeFunctionID = decodeVector[arrayIndex]
    while ((arrayIndex < decodeVector.length) && (decodeVector[arrayIndex] === decodeFunctionID)) {
      value += inputVector[arrayIndex]
      arrayIndex++
      numBits++
    }
    resultStr += decodeHash[decodeFunctionID] + ' [' + numBits.toString() + ']: ' + value.toString(2) + 'b = ' + value.toString() + '\n'
    decodeFunctionID = 0
    numBits = 0
    value = 0
  }

  return resultStr
}

function test () {

  test_decodeVector = [1, 1, 1, 2, 3, 3, 3, 3]
  test_decodeHash = {1: 'first field', 2: 'second field', 3: 'third field'}
  //#Test input vector long as decoder
  console.log(decode([0, 0, 1, 1, 0, 0, 1, 1], test_decodeVector, test_decodeHash))

  //Test input vector longer than decoder
  console.log(decode([0, 0, 1, 1, 0, 0, 1, 1, 1], test_decodeVector, test_decodeHash))

  //Test input smaller than decoder
  console.log(decode([0, 0, 1, 1, 0, 1], test_decodeVector, test_decodeHash))

}

test()
