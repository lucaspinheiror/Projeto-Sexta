*** Settings ***
Library    SeleniumLibrary

Suite Setup       Abrir Navegador
Suite Teardown    Fechar Navegador

*** Variables ***
${URL}    http://localhost:5173/

*** Test Cases ***

CT01 - Cadastrar Idoso

    Go To    ${URL}

    Wait Until Page Contains Element    xpath=//body    10s
    Wait Until Element Is Visible       id=nome-idoso    10s

    Input Text    id=nome-idoso      José da Silva
    Input Text    id=idade-idoso     68
    Input Text    id=altura-idoso    1.75
    Input Text    id=peso-idoso      82.5
    Input Text    id=senha-idoso     12345678

    Click Button    xpath=//button[contains(.,'Cadastrar')]

    Wait Until Page Contains Element    xpath=//body    10s


*** Keywords ***

Abrir Navegador
    Open Browser    ${URL}    chrome
    Maximize Browser Window
    Set Selenium Timeout    15s

Fechar Navegador
    Close Browser