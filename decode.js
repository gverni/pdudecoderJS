function decode (inputVector, decodeVector, decodeHash) {
  var resultStr = []
  console.log('Length of input vector:' + String(inputVector.length))
  console.log('Length of decode vector: ' + String(decodeVector.length))
  if (inputVector.length > decodeVector.length) {
    console.log('Warning: decoding array shorter than input vector. Leftmost bits of input array will not be decoded')
    decodeVector = Array(inputVector.length - decodeVector.length).fill(0).concat(decodeVector)
    console.log('Decode Vector: ' + decodeVector)
  } else if (inputVector.length < decodeVector.length) {
    console.log('Warning: input vector shorter than decoding array. Padding the leftmost bits to 0')
    inputVector = Array(decodeVector.length - inputVector.length).fill(0).concat(inputVector)
    console.log('Input Vector: ' + inputVector)
  }

  var arrayIndex = 0
  var decodeFunctionID = 0
  var valueBinStr = ''
  while (arrayIndex < inputVector.length) {
    decodeFunctionID = decodeVector[arrayIndex]
    while ((arrayIndex < decodeVector.length) && (decodeVector[arrayIndex] === decodeFunctionID)) {
      valueBinStr += String(inputVector[arrayIndex])
      arrayIndex++
    }
    resultStr.push(decodeHash[decodeFunctionID] + ' [' + String(valueBinStr.length) + ']: ' + valueBinStr + 'b = ' + String(parseInt(valueBinStr, 2)))
    decodeFunctionID = 0
    valueBinStr = ''
  }

  return resultStr
}

function createDecodeHash (inputStr) {
  // TODO: check validity of inputStr (e.g. overlapping regions)
  var decodeVector = []
  var decodeHash = ['Undecoded bit(s)']

  inputStr.split(/\r?\n/).forEach(function (line) {
    var lineSplit = line.match(/\[(\d+):(\d+)\] (.*)/)
    if (lineSplit!== null && lineSplit.length === 4) { // Check .match function returned correct values
      var startBit = parseInt(lineSplit[1])
      var stopBit = parseInt(lineSplit[2])
      var decodeStrID = decodeHash.length
      decodeHash[decodeStrID] = lineSplit[3]
      if (Math.max(startBit, stopBit) > decodeVector.length - 1) {
        decodeVector = Array((Math.max(startBit, stopBit) + 1) - decodeVector.length).fill(0).concat(decodeVector)
      }
      var sequenceLength = Math.abs(startBit - stopBit) + 1
      Array.prototype.splice.apply(decodeVector, [Math.min(startBit, stopBit), sequenceLength].concat(Array(sequenceLength).fill(decodeStrID)))
    }
  })
  decodeVector = decodeVector.reverse()
  console.log(decodeVector)
  console.log(decodeHash)
  return [decodeVector, decodeHash]
}

function test () {
  var testStr = '[7:5] first field\n[4:4] second field\n[3:0] third field'
  // var testDecodeVector = [1, 1, 1, 2, 3, 3, 3, 3]
  // var testDecodeHash = {1: 'first field', 2: 'second field', 3: 'third field'}
  var testDecodeAr = createDecodeHash(testStr)
  var testDecodeVector = testDecodeAr[0]
  var testDecodeHash = testDecodeAr[1]
  console.log(testDecodeVector)
  console.log(testDecodeHash)
  // Test input vector long as decoder
  console.log(decode([0, 0, 1, 1, 0, 0, 1, 1], testDecodeVector, testDecodeHash))

  // Test input vector longer than decoder
  console.log(decode([0, 0, 1, 1, 0, 0, 1, 1, 1], testDecodeVector, testDecodeHash))

  // Test input smaller than decoder
  console.log(decode([0, 0, 1, 1, 0, 1], testDecodeVector, testDecodeHash))
}
