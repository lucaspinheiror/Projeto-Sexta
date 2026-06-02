*** Settings ***
Library    SeleniumLibrary
Library    OperatingSystem

Suite Setup       Abrir Navegador
Suite Teardown    Fechar Navegador

*** Variables ***
${URL}    http://localhost:5173

*** Test Cases ***

CT01 - Cadastrar Consulta

    Input Text    id=nome-idoso    Mateus Vieira
    Input Text    id=idade-idoso    65
    Input Text    id=altura-idoso    175
    Input Text    id=peso-idoso    80
    Input Text    id=senha-idoso    123456

    Capture Page Screenshot    evidencias/01_formulario_idoso_preenchido.png

    Click Element    xpath=//button[contains(.,'Cadastrar')]

    Sleep    2s

    Capture Page Screenshot    evidencias/02_tela_principal.png

    Click Element    xpath=(//span[normalize-space()='15'])[1]

    Click Element    xpath=//button[contains(.,'Adicionar tarefa')]
    Click Element    xpath=//button[contains(.,'Consulta')]

    Input Text    xpath=//input[@placeholder='Dr. João Silva']    Dr. Carlos
    Input Text    xpath=//input[@placeholder='Hospital Santa Luzia']    Hospital Santa Luzia
    Input Text    xpath=//input[@type='time']    14:00

    Select From List By Label    xpath=(//select)[1]    Pedro

    Input Text    xpath=//textarea    Levar exames

    Click Element    xpath=//button[contains(.,'Salvar Consulta')]

    Sleep    1s

    Capture Page Screenshot    evidencias/03_consulta_cadastrada.png

    Page Should Contain    Consulta: Dr. Carlos

CT02 - Editar Consulta

    Click Element    xpath=//button[contains(.,'Editar')]

    Clear Element Text    xpath=//input[@placeholder='Dr. João Silva']
    Input Text    xpath=//input[@placeholder='Dr. João Silva']    Dr. Roberto

    Clear Element Text    xpath=//input[@placeholder='Hospital Santa Luzia']
    Input Text    xpath=//input[@placeholder='Hospital Santa Luzia']    Hospital Brasília

    Select From List By Label    xpath=(//select)[1]    João

    Click Element    xpath=//button[contains(.,'Atualizar')]

    Sleep    1s

    Capture Page Screenshot    evidencias/04_consulta_editada.png

    Page Should Contain    Consulta: Dr. Roberto

*** Keywords ***

Abrir Navegador
    Create Directory    evidencias
    Open Browser    ${URL}    chrome
    Maximize Browser Window

Fechar Navegador
    Close Browser