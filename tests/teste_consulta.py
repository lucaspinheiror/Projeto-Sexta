from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
import time
import os

os.makedirs("evidencias", exist_ok=True)

driver = webdriver.Chrome()

try:
    driver.get("http://localhost:5173")
    driver.maximize_window()

    # Cadastro Idoso

    driver.find_element(By.ID, "nome-idoso").send_keys("Mateus Vieira")
    driver.find_element(By.ID, "idade-idoso").send_keys("65")
    driver.find_element(By.ID, "altura-idoso").send_keys("175")
    driver.find_element(By.ID, "peso-idoso").send_keys("80")
    driver.find_element(By.ID, "senha-idoso").send_keys("123456")

    driver.save_screenshot(
        "evidencias/01_formulario_idoso_preenchido.png"
    )

    driver.find_element(
        By.XPATH,
        "//button[contains(.,'Cadastrar')]"
    ).click()

    time.sleep(2)

    driver.save_screenshot(
        "evidencias/02_tela_principal.png"
    )

    # Cadastro Consulta

    driver.find_element(
        By.XPATH,
        "(//span[normalize-space()='15'])[1]"
    ).click()

    driver.find_element(
        By.XPATH,
        "//button[contains(.,'Adicionar tarefa')]"
    ).click()

    driver.find_element(
        By.XPATH,
        "//button[contains(.,'Consulta')]"
    ).click()

    driver.find_element(
        By.XPATH,
        "//input[@placeholder='Dr. João Silva']"
    ).send_keys("Dr. Carlos")

    driver.find_element(
        By.XPATH,
        "//input[@placeholder='Hospital Santa Luzia']"
    ).send_keys("Hospital Santa Luzia")

    driver.find_element(
        By.XPATH,
        "//input[@type='time']"
    ).send_keys("14:00")

    Select(
        driver.find_elements(By.TAG_NAME, "select")[0]
    ).select_by_visible_text("Pedro")

    driver.find_element(
        By.TAG_NAME,
        "textarea"
    ).send_keys("Levar exames")

    driver.find_element(
        By.XPATH,
        "//button[contains(.,'Salvar Consulta')]"
    ).click()

    time.sleep(1)

    driver.save_screenshot(
        "evidencias/03_consulta_cadastrada.png"
    )

    # Editar Consulta

    driver.find_element(
        By.XPATH,
        "//button[contains(.,'Editar')]"
    ).click()

    campo = driver.find_element(
        By.XPATH,
        "//input[@placeholder='Dr. João Silva']"
    )

    campo.clear()
    campo.send_keys("Dr. Roberto")

    driver.find_element(
        By.XPATH,
        "//button[contains(.,'Atualizar')]"
    ).click()

    time.sleep(1)

    driver.save_screenshot(
        "evidencias/04_consulta_editada.png"
    )

finally:
    driver.quit()