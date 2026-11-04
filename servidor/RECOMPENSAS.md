# Recompensas BoaPay

O servidor cria as tabelas de pagamentos simulados, viagens, cupons ODS 8 e lançamentos BoaPay na base `boatour_bd` ao iniciar.

Cupons ODS 8 aplicam desconto conforme o total da compra em que forem usados: 5% até R$ 500, 10% acima de R$ 500 até R$ 1.000 e 15% acima de R$ 1.000. Cada item ODS 8 de uma compra aprovada gera seu próprio cupom.

Quando uma compra aprovada incluir ao menos um item ODS 12, 5% do valor total do pedido é creditado ao saldo BoaPay uma vez por pedido. O movimento fica vinculado ao pagamento e não é duplicado se o pagamento for registrado novamente.
