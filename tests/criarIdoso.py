import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os

URL = "http://localhost:5173/"

driver = webdriver.Chrome()
driver.maximize_window()

os.makedirs("teste_selenium", exist_ok=True)


def cadastrar_idoso(nome, idade, altura, peso, senha, ct):
    driver.get(URL)

    WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.ID, "nome-idoso"))
    )

    driver.find_element(By.ID, "nome-idoso").send_keys(nome)
    driver.find_element(By.ID, "idade-idoso").send_keys(idade)
    driver.find_element(By.ID, "altura-idoso").send_keys(altura)
    driver.find_element(By.ID, "peso-idoso").send_keys(peso)
    driver.find_element(By.ID, "senha-idoso").send_keys(senha)

    # Print antes do cadastro
    driver.save_screenshot(f"teste_selenium/{ct}_antes.png")

    driver.find_element(
        By.XPATH,
        "//button[contains(.,'Cadastrar')]"
    ).click()

    time.sleep(3)
    WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.TAG_NAME, "body"))
    )

    # Print depois do cadastro
    driver.save_screenshot(f"teste_selenium/{ct}_depois.png")


try:
    cadastrar_idoso(
        "José da Silva",
        "68",
        "1.75",
        "82.5",
        "12345678",
        "CT01"
    )

    cadastrar_idoso(
        "João Cleber",
        "50",
        "1.75",
        "82.5",
        "12345678",
        "CT02"
    )

    cadastrar_idoso(
        "Éder da Silva",
        "90",
        "2",
        "82.5",
        "123",
        "CT03"
    )

finally:
    driver.quit()