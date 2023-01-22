/**
 * @param event
 * @param state
 * @param setState
 */

export const handleChange = (event, state, setState) => {
  const target = event.target
  let value = target.value
  switch (target.type) {
    case 'number':
      value = value > 0 && !isNaN(value) ? parseFloat(value) : 0
      break
    case 'checkbox':
      value = target.checked
      break
    default:
      value = target.value
      break
  }
  setState({...state, [target.name]: value})
}

/**
 * @param event
 * @param state
 * @param setState
 */
export const onStrictNumChange = (event, state, setState) => {
  const target = event.target
  const value = target.value > 0 && !isNaN(target.value) ? parseFloat(target.value) : 0
  setState({...state, [target.name]: value})
}

/**
 * @param event
 * @param index
 * @param state
 * @param setState
 */
export const onArrayChange = (event, index, state = [], setState) => {
  const target = event.target, data = [...state]
  let value = target.value
  switch (target.type) {
    case 'number':
      value = value > 0 && !isNaN(value) ? parseFloat(value) : 0
      break
    case 'checkbox':
      value = target.checked
      break
    default:
      value = target.value
      break
  }
  data[index][target.name] = value
  setState(data)
}

/**
 * @param items
 * @param state
 * @param setState
 */
export const onAddArrayClick = (items = {}, state = [], setState) => setState([...state, items])

/**
 * @param index
 * @param state
 * @param setState
 */
export const onRemoveArrayClick = (index, state = [], setState) => {
  const values = [...state]
  values.splice(index, 1)
  setState(values)
}

/**
 * @param event
 * @param name
 * @param state
 * @param setState
 * @param isValueExists
 */
export const onSelectChange = (event, name, state, setState, isValueExists = false) => {
  setState({...state, [name]: event})
}
