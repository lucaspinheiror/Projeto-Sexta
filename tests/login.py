from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os

driver = webdriver.Chrome()
wait = WebDriverWait(driver, 10)

URL = "http://localhost:5173"

# -------------------------
# Setup
# -------------------------
driver.get(URL)
driver.maximize_window()

os.makedirs("evidencias", exist_ok=True)

# =========================
# CT01 - Cadastrar Idoso + Consulta
# =========================

wait.until(EC.presence_of_element_located((By.ID, "nome-idoso")))

driver.find_element(By.ID, "nome-idoso").send_keys("Mateus Vieira")
driver.find_element(By.ID, "idade-idoso").send_keys("65")
driver.find_element(By.ID, "altura-idoso").send_keys("175")
driver.find_element(By.ID, "peso-idoso").send_keys("80")
driver.find_element(By.ID, "senha-idoso").send_keys("123456")

driver.save_screenshot("evidencias/01_formulario_idoso_preenchido.png")

driver.find_element(By.XPATH, "//button[contains(.,'Cadastrar')]").click()

wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))

driver.save_screenshot("evidencias/02_tela_principal.png")

driver.find_element(By.XPATH, "(//span[normalize-space()='15'])[1]").click()

driver.find_element(By.XPATH, "//button[contains(.,'Adicionar tarefa')]").click()
driver.find_element(By.XPATH, "//button[contains(.,'Consulta')]").click()

driver.find_element(By.XPATH, "//input[@placeholder='Dr. João Silva']").send_keys("Dr. Carlos")
driver.find_element(By.XPATH, "//input[@placeholder='Hospital Santa Luzia']").send_keys("Hospital Santa Luzia")
driver.find_element(By.XPATH, "//input[@type='time']").send_keys("14:00")

Select(driver.find_element(By.TAG_NAME, "select")).select_by_visible_text("Pedro")

driver.find_element(By.TAG_NAME, "textarea").send_keys("Levar exames")

driver.find_element(By.XPATH, "//button[contains(.,'Salvar Consulta')]").click()

wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))

driver.save_screenshot("evidencias/03_consulta_cadastrada.png")

assert "Consulta: Dr. Carlos" in driver.page_source


# =========================
# CT02 - Editar Consulta
# =========================

driver.find_element(By.XPATH, "//button[contains(.,'Editar')]").click()

campo_medico = driver.find_element(By.XPATH, "//input[@placeholder='Dr. João Silva']")
campo_medico.clear()
campo_medico.send_keys("Dr. Roberto")

campo_hospital = driver.find_element(By.XPATH, "//input[@placeholder='Hospital Santa Luzia']")
campo_hospital.clear()
campo_hospital.send_keys("Hospital Brasília")

Select(driver.find_element(By.TAG_NAME, "select")).select_by_visible_text("João")

driver.find_element(By.XPATH, "//button[contains(.,'Atualizar')]").click()

wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))

driver.save_screenshot("evidencias/04_consulta_editada.png")

assert "Consulta: Dr. Roberto" in driver.page_source


# =========================
# Teardown
# =========================

driver.quit()