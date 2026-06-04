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

    Capture Page Screenshot    teste_sala/CT01_preenchido.png

    Click Button    xpath=//button[contains(.,'Cadastrar')]
    
    Sleep    2s

    Capture Page Screenshot    teste_sala/CT01_resultado.png

    Wait Until Page Contains Element    xpath=//body    10s

CT02 - Cadastrar Idoso

    Go To    ${URL}

    Wait Until Page Contains Element    xpath=//body    10s
    Wait Until Element Is Visible       id=nome-idoso    10s

    Input Text    id=nome-idoso      João Cleber
    Input Text    id=idade-idoso     50
    Input Text    id=altura-idoso    1.75
    Input Text    id=peso-idoso      82.5
    Input Text    id=senha-idoso     12345678

    Capture Page Screenshot    teste_sala/CT02_preenchido.png

    Click Button    xpath=//button[contains(.,'Cadastrar')]

    Sleep    2s

    Capture Page Screenshot    teste_sala/CT02_resultado.png

    Wait Until Page Contains Element    xpath=//body    10s

CT03 - Cadastrar Idoso

    Go To    ${URL}

    Wait Until Page Contains Element    xpath=//body    10s
    Wait Until Element Is Visible       id=nome-idoso    10s

    Input Text    id=nome-idoso      Éder da Silva
    Input Text    id=idade-idoso     90
    Input Text    id=altura-idoso    2
    Input Text    id=peso-idoso      82.5
    Input Text    id=senha-idoso     123

    Capture Page Screenshot    teste_sala/CT03_preenchido.png

    Click Button    xpath=//button[contains(.,'Cadastrar')]

    Sleep    2s

    Capture Page Screenshot    teste_sala/CT03_resultado.png

    Wait Until Page Contains Element    xpath=//body    10s


*** Keywords ***

Abrir Navegador
    Open Browser    ${URL}    chrome
    Maximize Browser Window
    Set Selenium Timeout    15s

Fechar Navegador
    Close Browser