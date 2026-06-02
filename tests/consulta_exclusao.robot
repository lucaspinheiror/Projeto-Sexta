*** Settings ***
Library    SeleniumLibrary

*** Test Cases ***
Cadastrar Vazio E Excluir Tarefa
    Open Browser    http://localhost:5173    chrome
    Maximize Browser Window

    # Clica em Cadastrar sem preencher nada
    Click Button    xpath=//button[contains(.,'Cadastrar')]

    # Aguarda a tela da agenda carregar
    Wait Until Page Contains    Agenda do Idoso    10s

    # Clica no dia 5
    Click Element    xpath=//div[normalize-space()='5']

    # Aguarda o painel lateral abrir
    Wait Until Element Is Visible    xpath=//button[contains(.,'Excluir')]    10s

    # Clica em Excluir
    Click Button    xpath=//button[contains(.,'Excluir')]

    # Confirma o alerta nativo do navegador
    Handle Alert    ACCEPT