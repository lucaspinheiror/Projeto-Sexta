*** Settings ***
Library    SeleniumLibrary

Suite Setup       Abrir Navegador
Suite Teardown    Close All Browsers

*** Variables ***
${URL}    http://localhost:5173/login


*** Test Cases ***

CT01 - Login válido
    Ir Para Login

    Input Text    id=Nome     José da Silva
    Input Text    id=Senha    12345678

    Click Button    xpath=//button[contains(.,'Login')]

    Wait Until Location Contains    tela-principal    10s


CT02 - Nome obrigatório
    Ir Para Login

    Input Text    id=Senha    12345678

    Click Button    xpath=//button[contains(.,'Login')]

    Page Should Contain    Nome obrigatório


CT03 - Senha obrigatória
    Ir Para Login

    Input Text    id=Nome     José da Silva

    Click Button    xpath=//button[contains(.,'Login')]

    Page Should Contain    Senha obrigatória


CT04 - Credenciais inválidas
    Ir Para Login

    Input Text    id=Nome     UsuarioInexistente
    Input Text    id=Senha    000000

    Click Button    xpath=//button[contains(.,'Login')]

    Page Should Contain    Credenciais inválidas


*** Keywords ***

Abrir Navegador
    Open Browser    ${URL}    chrome
    Maximize Browser Window
    Set Selenium Timeout    15s

Ir Para Login
    Go To    ${URL}
    Wait Until Element Is Visible    id=Nome    10s

Close All Browsers
    Close All Browsers