var database = require("../database/config");

function alerta_unidade(bebida) {

    instrucaoSql = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `select top 1
        dht11_temperatura as temperatura, 
        dht11_umidade as umidade,  
                        CONVERT(varchar, momento, 108) as momento_grafico, 
                        fk_aquario 
                        from medida where fk_aquario = ${idAquario} 
                    order by id desc`;

    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `SELECT tb_local.nome as 'unidade', concat(rua, ', ', ifnull(numero, 'S/N'), ' - ', bairro, ' - ', cep, ' - ', cidade, ' - ', estado) as 'endereco',
        count(id_registro) as 'saidas'
    FROM tb_maquina
        JOIN tb_local ON tb_local.id_local = tb_maquina.fk_local
        JOIN tb_dispenser ON tb_dispenser.fk_maquina = tb_maquina.id_maquina
        JOIN tb_bebida ON tb_bebida.id_bebida = tb_dispenser.fk_bebida
        JOIN tb_sensor ON tb_dispenser.id_dispenser = tb_sensor.fk_dispenser
        JOIN tb_registro ON tb_sensor.id_sensor = tb_registro.fk_sensor
        WHERE tb_bebida.nome_bebida = '${bebida}'
        GROUP BY fk_local`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function meta_prazo(bebida) {

    instrucaoSql = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `select top 1
        dht11_temperatura as temperatura, 
        dht11_umidade as umidade,  
                        CONVERT(varchar, momento, 108) as momento_grafico, 
                        fk_aquario 
                        from medida where fk_aquario = ${idAquario} 
                    order by id desc`;

    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `SELECT tb_local.nome as 'unidade', concat(rua, ', ', ifnull(numero, 'S/N'), ' - ', bairro, ' - ', cep, ' - ', cidade, ' - ', estado) as 'endereco',
        count(id_registro) as 'saidas'
    FROM tb_maquina
        JOIN tb_local ON tb_local.id_local = tb_maquina.fk_local
        JOIN tb_dispenser ON tb_dispenser.fk_maquina = tb_maquina.id_maquina
        JOIN tb_bebida ON tb_bebida.id_bebida = tb_dispenser.fk_bebida
        JOIN tb_sensor ON tb_dispenser.id_dispenser = tb_sensor.fk_dispenser
        JOIN tb_registro ON tb_sensor.id_sensor = tb_registro.fk_sensor
        WHERE tb_bebida.nome_bebida = '${bebida}'
        GROUP BY fk_local`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    alerta_unidade,
    meta_prazo
}