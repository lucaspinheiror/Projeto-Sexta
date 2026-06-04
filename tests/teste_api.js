pm.test("Status code deve ser 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Resposta possui id", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.id).to.exist;
});

pm.test("Nome retornado corretamente", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.nome).to.eql("José Silva");
});

pm.test("Idade retornada corretamente", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.idade).to.eql(70);
});