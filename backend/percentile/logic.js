const percentile = (data, value) => {
    const sorted_data = data.sort((a, b) => (a - b));
  
    // Edge cases
    if (value == Math.max(...sorted_data)){
      return 100;
    } else if (value < Math.min(...sorted_data)){
      return 0;
    }
  
    // Count number of elements below value
    let count = 0;
    for (let i in sorted_data){
      if (sorted_data[i] < value) {
        count++;
      } else if (sorted_data[i] == value) {
        break;
      }
    }
  
    // Check the number of elements equal to value
    const isDuplicate = sorted_data.filter(num => num === value).length;
    if (isDuplicate == 1) {
      const result = (count/sorted_data.length)*100;
      return result;
    }
    
    const result = ((count + (0.5 * sorted_data.filter(num => num === value).length))/sorted_data.length)*100
    return +(Math.round(result + "e+2")  + "e-2");
}

module.exports = { percentile };