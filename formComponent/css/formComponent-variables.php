<?php
    header('Content-type: text/css');
    $color1 = "#ffffff"; // es. usando variabile php per i colori
?>

/* variabili qui sotto */

:host {
    --form-component-global-font: 'Lato';
    --form-and-input-bgcolor: <?= $color1 ?>;
    --input-text-color: #1a1a1a;
    --input-text-selection-bg-color: #dbdbdb;
    --input-border-bottom-color: #404040;
    --legend-text-color: #404040;
    --label-text-color: #404040;
    --label-text-color-focus: #2da900;

    --option-text-color: #404040;
    --option-border-color: #bdbdbd;
    --option-selected-bg-color: #ececec;

    --radio-checkbox-bg-color: #f0f0f0;
    --radio-checkbox-option-results-number-bg-color: #2da90090;
    --radio-checkbox-option-results-number-text-color: #ffffff;
    --datalist-select-menu-bgcolor: #ffffff;

    --input-range-preview-color: #ffffff;
    --input-range-track-color: #404040;

    --switch-bg-color: #e0e0e0;
    
    --attached-file-url-text-color: #ffffff;
    --attached-file-url-bg-color: #2da900;
    --attached-file-text-color: #404040;
    --attached-file-details-bg-color: #dbdbdb;
    --input-underline-bgcolor: #404040;
    --input-underline-bgcolor-focus: #2da900;
    --input-invalid-feedback-color: #ca0000;
    --input-valid-feedback-color: #2da900;
    --input-feedback-color: #404040;
    --form-submit-button-bg-color: #1a1a1a;
    --form-submit-button-outline-color: #1a1a1a30;
    --form-submit-button-text-color: #ffffff;

    --icon-font-material: 'Material Symbols Outlined';

    /* DATE TIME SELECT */
    --date-time-picker-details-color: #2da900;
    --date-time-picker-details-color-dark: #154d00;
    --date-time-picker-bgcolor: #ffffff;
    --date-time-picker-text-color: #1a1a1a;
    --date-time-picker-border-color: #cdcdcd;
    --date-time-picker-shadow-color: #9b9b9b;
    --date-time-picker-day-names-text-color: #9b9b9b;
    --date-time-picker-color-hover: #dedede;
    --date-time-picker-invalid-color: #ca0000;
    --date-time-picker-invalid-color-dark: #9c0000;

    /* COLOR PICKER */
    --color-picker-box-border-color: #cdcdcd;
    --color-picker-shadow-color: #9b9b9b;
    --color-picker-bgcolor: #ffffff;
    --color-picker-text-color: #404040;
    --color-picker-border-color: #404040;

    --color-picker-input-write-color-bgcolor: #ffffff;
    --color-picker-input-write-color-text-color: #1a1a1a;

    --color-picker-button-bgcolor: #ffffff;
    --color-picker-button-hover-bgcolor: #f0f0f0;
    --color-picker-button-active-bgcolor: var(--input-valid-feedback-color);
    --color-picker-button-active-text-color: #ffffff;

    --color-picker-input-write-color-selection-bgcolor: rgba(255, 255, 255, 0);
    --color-picker-input-write-color-selection-underline-color: #40404060;
    --color-picker-input-write-color-moz-selection-no-underline-bgcolor: #40404040;
}
