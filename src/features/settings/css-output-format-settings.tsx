import * as React from 'react';
import { CssStyle } from '../../code-builder/buildCssString';
import { messageTypes } from '../../messagesTypes';
import Spacer from '../../ui/Spacer';
import styles from './css-output-format-settings.css'

const cssStyles: { value: CssStyle; label: string }[] = [
    { value: 'css', label: 'CSS' },
    { value: 'styled-components', label: 'styled-components' }
]

export const CSSOutputFormatSettings:any = ({notifyChangeCssStyle,selectedCssStyle}:any) => {
   

    return (
        <>
            <div className={styles.settings}>
                <h2 className={styles.heading}>Settings</h2>

                <Spacer axis="vertical" size={12} />

                <div className={styles.optionList}>
                    {cssStyles.map((style) => (
                        <div key={style.value} className={styles.option}>
                            <input type="radio" name="css-style" id={style.value} value={style.value} checked={selectedCssStyle === style.value} onChange={notifyChangeCssStyle} />
                            <label htmlFor={style.value}>{style.label}</label>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}