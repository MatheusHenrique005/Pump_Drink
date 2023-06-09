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
            LEFT JOIN tb_local ON tb_local.id_local = tb_maquina.fk_local
            LEFT JOIN tb_dispenser ON tb_dispenser.fk_maquina = tb_maquina.id_maquina
            LEFT JOIN tb_bebida ON tb_bebida.id_bebida = tb_dispenser.fk_bebida
            LEFT JOIN tb_sensor ON tb_dispenser.id_dispenser = tb_sensor.fk_dispenser
            LEFT JOIN tb_registro ON tb_sensor.id_sensor = tb_registro.fk_sensor
            WHERE tb_bebida.id_bebida = ${bebida}
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
        instrucaoSql = `
            SELECT date_format(prazo_final, '%d-%m-%Y') as 'prazo',
                meta_geral as 'meta'
            FROM tb_bebida
            WHERE id_bebida = ${bebida}
        ;`;

    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `
            SELECT date_format(prazo_final, '%d-%m-%Y') as 'prazo',
                meta_geral as 'meta'
            FROM tb_bebida
            WHERE id_bebida = ${bebida}
        ;`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function todas_bebidas(){

    instrucaoSql = `
        SELECT bebida.id_bebida, bebida.nome_bebida,
                (
                    SELECT count(*)
                    FROM tb_registro
                        JOIN tb_sensor ON id_sensor = fk_sensor
                        JOIN tb_dispenser ON id_dispenser = fk_dispenser
                    WHERE fk_bebida = bebida.id_bebida
                ) * 100 / (
                    SELECT meta_geral / timestampdiff(day, prazo_inicio, prazo_final) * 
                    timestampdiff(day, prazo_inicio, now())
                    FROM tb_bebida
                    WHERE id_bebida = bebida.id_bebida
            ) as 'desempenho_geral'
        FROM tb_bebida bebida
        ORDER BY desempenho_geral;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar_unidade(dispenser1, dispenser2, dispenser3, dispenser4, nome, descricao, rua, num, comp, cep, bairro, cidade, estado, regiao, pais){
    var instrucaoSql1 = `
        INSERT INTO tb_local VALUES 
            (null, '${nome}', '${pais}', '${regiao}', '${estado}', '${cidade}', '${bairro}', '${rua}', ${num}, '${comp}', '${cep}');
    `;

    var instrucaoSql2 = `
        INSERT INTO tb_maquina VALUES
            (null, '${descricao}', (SELECT id_local FROM tb_local ORDER BY id_local DESC LIMIT 1))
    `;

    var instrucaoSql3 = `
        INSERT INTO tb_dispenser VALUES
            (null, 1, (SELECT id_maquina FROM tb_maquina ORDER BY id_maquina DESC LIMIT 1), ${dispenser1}),
            (null, 2, (SELECT id_maquina FROM tb_maquina ORDER BY id_maquina DESC LIMIT 1), ${dispenser2}),
            (null, 3, (SELECT id_maquina FROM tb_maquina ORDER BY id_maquina DESC LIMIT 1), ${dispenser3}),
            (null, 4, (SELECT id_maquina FROM tb_maquina ORDER BY id_maquina DESC LIMIT 1), ${dispenser4});
    `;

    database.executar(instrucaoSql1);
    database.executar(instrucaoSql2);
    return database.executar(instrucaoSql3);
}

function cadastrar_bebida(nome, tipo, prazo_inicio, prazo_final, meta, id_empresa) {
    
    var instrucaoSql = `
        INSERT INTO tb_bebida (
            nome_bebida,
            tipo,
            fk_empresa,
            prazo_inicio,
            prazo_final,
            meta_geral
        )
        VALUES (
            '${nome}',
            '${tipo}',
            ${id_empresa},
            '${prazo_inicio}',
            '${prazo_final}',
            '${meta}'
        );
    `;
        
    return database.executar(instrucaoSql)
}

module.exports = {
    alerta_unidade,
    meta_prazo,
    cadastrar_unidade,
    todas_bebidas,
    cadastrar_bebida
}