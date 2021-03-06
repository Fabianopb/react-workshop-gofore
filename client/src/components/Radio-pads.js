import React, {Component} from 'react'
import {PropTypes} from 'prop-types'
import './Radio-pads.css'

class RadioPads extends Component {
  state = {selected: ''}

  handleSelection = e => {
    const selected = e.target.value
    this.setState({selected})
    this.props.handleSelection(selected)
  };

  render() {
    const {options: opts, disabled} = this.props
    return (
      <div className='options-wrapper'>
        {opts.map((country, key) => {
          const code = Object.keys(country)[0]
          const isCurrent = this.state.selected === code
          return (
            <div key={key} className='Radio-pad'>
              <div>
                <label
                  className={
                    isCurrent
                      ? 'Radio-pad-wrapper Radio-pad-wrapper--selected'
                      : 'Radio-pad-wrapper'
                  }
                >
                  <input
                    className='Radio-pad-radio'
                    type='radio'
                    name='countries'
                    id={code}
                    value={code}
                    onChange={this.handleSelection}
                    disabled={disabled}
                  />
                  {country[code]}
                </label>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}

RadioPads.propTypes = {
  options: PropTypes.array.isRequired,
  disabled: PropTypes.bool,
  handleSelection: PropTypes.func.isRequired
}

export default RadioPads
