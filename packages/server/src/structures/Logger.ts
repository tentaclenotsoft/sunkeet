import { Logger } from 'tslog'

export default class extends Logger {
  constructor (options = {}) {
    super({
      ...options,
      dateTimePattern: 'hour:minute:second',
      displayFunctionName: false
    })
  }
}
