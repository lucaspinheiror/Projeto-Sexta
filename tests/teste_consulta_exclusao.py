from time import sleep

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Chrome()
wait = WebDriverWait(driver, 10)

try:
    driver.get("http://localhost:5173")
    driver.maximize_window()

    sleep(2)

    # Clica em "Cadastrar" sem preencher nada
    wait.until(
        EC.element_to_be_clickable(
            (By.XPATH, "//button[contains(., 'Cadastrar')]")
        )
    ).click()

    sleep(3)

    # Aguarda a agenda carregar
    wait.until(
        EC.presence_of_element_located(
            (By.XPATH, "//*[contains(text(), 'Agenda do Idoso')]")
        )
    )

    sleep(2)

    # Clica no dia 5
    wait.until(
        EC.element_to_be_clickable(
            (By.XPATH, "//div[normalize-space()='5']")
        )
    ).click()

    sleep(3)

    # Clica no primeiro botão Excluir
    wait.until(
        EC.element_to_be_clickable(
            (By.XPATH, "(//button[contains(., 'Excluir')])[1]")
        )
    ).click()

    sleep(2)

    # Confirma o alerta do navegador
    alert = wait.until(EC.alert_is_present())
    sleep(2)
    alert.accept()

    sleep(3)

finally:
    driver.quit()