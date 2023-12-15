import * as React from 'react';
import { CssStyle } from '../../code-builder/buildCssString';
import { UnitType } from '../../code-builder/buildSizeStringByUnit';
import styles from './css-unit-type-settings.css'

const cssStyles: { value: CssStyle; label: string }[] = [
    { value: 'css', label: 'CSS' },
    { value: 'styled-components', label: 'styled-components' }
]

export const CSSUnitTypeSettings: any = ({ notifyChangeUnitType, selectedUnitType }: any) => {
    const unitTypes: { value: UnitType; label: string }[] = [
        { value: 'px', label: 'px' },
        { value: 'rem', label: 'rem' },
        { value: 'remAs10px', label: 'rem(as 10px)' }
    ]

    return (
        <>
            <div className={styles.settings}>
                <div className={styles.optionList}>
                    {unitTypes.map((unitType) => (
                        <div key={unitType.value} className={styles.option}>
                            <input type="radio" name="unit-type" id={unitType.value} value={unitType.value} checked={selectedUnitType === unitType.value} onChange={notifyChangeUnitType} />
                            <label htmlFor={unitType.value}>{unitType.label}</label>
                        </div>
                    ))}
                </div>
            </div>

        </>
    )
}