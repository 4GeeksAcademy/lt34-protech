"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from sqlite3 import IntegrityError
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Products, Seller , Comprador , Address
from api.utils import generate_sitemap, APIException
from flask_cors import CORS



api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/products', methods=['GET'])
def get_products():
    products = Products.query.all()
    
    products = list(map(lambda product: product.serialize(), products))
    
    return jsonify(products), 200

@api.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Products.query.get(product_id)

    if product is None:
        return jsonify({"message": "Product not found"}), 404
    
    return jsonify(product.serialize()), 200

@api.route('/products', methods=['POST'])
def add_product():
    new_product_data = request.get_json()

    if not new_product_data:
        return jsonify({"error": "No data provided for the new product."}), 400
    
    required_fields = ["name", "description", "price", "stock", "image"]
    if not all(field in new_product_data for field in required_fields):
        return jsonify({"error": "Required fields are missing: " + ', '.join(required_fields)}), 400
    
    if not isinstance(new_product_data["price"], (int, float)) or new_product_data["price"] < 0:
        return jsonify({"error": "The price must be a non-negative integer."}), 400
    
    if not isinstance(new_product_data["stock"], int) or new_product_data["stock"] < 0:
        return jsonify({"error": "The stock must be a non-negative integer."}), 400
    
    new_product = Products(
        name=new_product_data["name"],
        description=new_product_data["description"],
        price=new_product_data["price"],
        stock=new_product_data["stock"],
        image=new_product_data["image"]
    )
    
    db.session.add(new_product)
    db.session.commit()
    
    return jsonify({"message":"Product successfully added"}), 201

@api.route('/products/<int:product_id>', methods=['DELETE'])
def remove_product(product_id):

    product = Products.query.get(product_id)

    if not product:
        return jsonify({"message":"Product no found"}), 404

    db.session.delete(product)
    db.session.commit()
    
    return jsonify({"message": "Product successfully removed"}), 200

@api.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):

    product = Products.query.get(product_id)

    if product is None:
        return jsonify({"error": "Producto no encontrado."}), 404

   
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data has been provided for updating."}), 400

    if data["stock"]:
        if not isinstance(data["stock"], int) or data["stock"] < 0:
            return jsonify({"message":"The stock must be a non-negative integer."}), 400
    product.stock = data['stock']

    if data["price"]:
        if not isinstance(data["price"], int) or data["price"] < 0:
            return jsonify({"message":"The price must be a non-negative integer."}), 400
    product.price = data['price']

    # Actualiza directamente los campos del producto
    if 'name' in data:
        product.name = data['name']
    if 'description' in data:
        product.description = data['description']
    if 'image' in data:
        product.image = data['image']

    db.session.commit()
    
    return jsonify({"message":"Product successfully edited"}), 200







# Endpoints de Comprador

@api.route('/compradores', methods=['GET'])
def get_compradores():
    compradores = Comprador.query.all()  # Obtiene todos los compradores de la base de datos
    return jsonify([comprador.serialize() for comprador in compradores]), 200  # Devuelve los compradores en formato JSON

@api.route('/compradores/<int:comprador_id>', methods=['GET'])
def get_comprador(comprador_id):
    comprador = Comprador.query.get(comprador_id)  # Obtiene el comprador por ID
    if not comprador:
        return jsonify({"message": "Comprador no encontrado"}), 404  # Si no se encuentra, devuelve 404
    return jsonify(comprador.serialize()), 200  # Devuelve el comprador en formato JSON si lo encuentra

@api.route('/compradores', methods=['POST'])
def add_comprador():
    new_comprador_data = request.get_json()  # Obtiene los datos JSON enviados en la solicitud

    if not new_comprador_data:  # Verifica que se haya enviado algún dato
        return jsonify({"error": "No data provided"}), 400  # Si no se envía dato, devuelve error 400

    # Verifica que los campos requeridos estén presentes
    required_fields = ["name", "email", "clave", "telefono"]
    if not all(field in new_comprador_data for field in required_fields):
        return jsonify({"error": "Required fields are missing: " + ', '.join(required_fields)}), 400  # Si falta algún campo, devuelve error 400

    # Verifica si ya existe un comprador con el mismo email
    existing_comprador = Comprador.query.filter_by(email=new_comprador_data["email"]).first()
    if existing_comprador:
        return jsonify({"error": "Email is already in use"}), 400  # Si el email ya está en uso, devuelve error 400

    # Crea un nuevo comprador
    new_comprador = Comprador(
        name=new_comprador_data["name"],
        email=new_comprador_data["email"],
        clave=new_comprador_data["clave"],
        telefono=new_comprador_data["telefono"]
    )

    # Guarda el nuevo comprador en la base de datos
    db.session.add(new_comprador)
    db.session.commit()

    return jsonify({"message": "Comprador successfully added"}), 201  # Devuelve mensaje de éxito con código 201

@api.route('/compradores/<int:comprador_id>', methods=['PUT'])
def update_comprador(comprador_id):
    comprador = Comprador.query.get(comprador_id)  # Obtiene el comprador por ID

    if comprador is None:
        return jsonify({"error": "Comprador no encontrado"}), 404  # Si no se encuentra, devuelve error 404

    data = request.get_json()  # Obtiene los datos de la solicitud

    if not data:  # Verifica que los datos no estén vacíos
        return jsonify({"error": "No data has been provided for updating"}), 400  # Si no hay datos, devuelve error 400

    # Actualiza los campos solo si fueron proporcionados en la solicitud
    if 'name' in data:
        comprador.name = data['name']
    if 'email' in data:
        comprador.email = data['email']
    if 'clave' in data:
        comprador.clave = data['clave']
    if 'telefono' in data:
        comprador.telefono = data['telefono']

    db.session.commit()  # Guarda los cambios en la base de datos

    return jsonify({"message": "Comprador successfully updated"}), 200  # Devuelve mensaje de éxito

@api.route('/compradores/<int:comprador_id>', methods=['DELETE'])
def remove_comprador(comprador_id):
    comprador = Comprador.query.get(comprador_id)  # Obtiene el comprador por ID

    if comprador is None:
        return {"error": "Comprador no encontrado"}, 404  # Devuelve un error 404 si no se encuentra el comprador

    db.session.delete(comprador)  # Elimina el comprador de la base de datos
    db.session.commit()  # Confirma la transacción

    return {"message": "Comprador eliminado exitosamente"}, 200  # Devuelve un mensaje de éxito




    


#santiago/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


@api.route('/sellers', methods=['GET'])
def get_sellers():
    sellers = Seller.query.all()
    
    sellers = list(map(lambda seller: seller.serialize(), sellers))
    
    return jsonify(sellers), 200

@api.route('/seller/<int:seller_id>', methods=['GET'])
def get_seller(seller_id):
    seller = Seller.query.get(seller_id)
    if not seller:
        return jsonify({"msg": "Vendedor no encontrado"}), 404
    return jsonify(seller.serialize()), 200


@api.route('/seller/signup', methods=['POST'])
def signup():
    body = request.get_json()

    if not body or not body.get("email") or not body.get("password"):
        return jsonify({"msg": "Email y contraseña son requeridos"}), 400

    seller = Seller.query.filter_by(email=body["email"]).first()

    if seller is not None:
        return jsonify({"msg": "El usuario ya existe"}), 409

    new_seller = Seller(
        email=body["email"],
        password =body["password"],
        phone=body["phone"],
        bank_account=body["bank_account"],
        is_active=True)
     

    db.session.add(new_seller)
    db.session.commit()

    
    return jsonify({"msg": "Usuario creado exitosamente"}), 200


@api.route('/seller/<int:seller_id>', methods=['DELETE'])
def delete_seller(seller_id):
    seller = Seller.query.get(seller_id)
    
    if not seller :
        return jsonify({"msg": "No autorizado o vendedor no encontrado"}), 403

    db.session.delete(seller)
    db.session.commit()
    return jsonify({"msg": "Vendedor eliminado"}), 200

@api.route('/seller/<int:seller_id>', methods=['PUT'])
def update_seller(seller_id):

    seller = Seller.query.get(seller_id)

    if seller is None:
        return jsonify({"error": "vendedor no existe."}), 404

   
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data has been provided for updating."}), 400

   
    if 'email' in data:
        seller.email = data['email']
    if 'password' in data:
        seller.password = data['password']
    if 'phone' in data:
        seller.phone = data['phone']
    if 'bank_account' in data:
        seller.bank_account = data['bank_account']

    db.session.commit()
    
    return jsonify({"msg":"vendedor actualizado"}), 200



#//////////////////////damian

# Obtener todas las direcciones
@api.route('/address', methods=['GET'])
def get_addresses():
    addresses = Address.query.all()  # Obtiene todas las direcciones de la base de datos
    return jsonify([address.serialize() for address in addresses]), 200  # Devuelve en formato JSON

# Obtener una dirección por su ID
@api.route('/address/<int:address_id>', methods=['GET'])
def get_address(address_id):
    address = Address.query.get(address_id)  # Obtiene la dirección por ID
    if not address:
        return jsonify({"message": "Dirección no encontrada"}), 404  # Si no se encuentra, devuelve 404
    return jsonify(address.serialize()), 200  # Devuelve la dirección en formato JSON si la encuentra

# Agregar una nueva dirección
@api.route('/address', methods=['POST'])
def add_address():
    new_address_data = request.get_json()  # Obtiene los datos JSON enviados en la solicitud
    
    if not new_address_data:  # Verifica que se haya enviado algún dato
        return jsonify({"error": "No se proporcionaron datos"}), 400  # Si no se envían datos, devuelve error 400

    # Verifica que los campos requeridos estén presentes
    required_fields = ["address", "codigo_postal", "ciudad", "pais"]
    if not all(field in new_address_data for field in required_fields):
        return jsonify({"error": f"Faltan campos requeridos: {', '.join(required_fields)}"}), 400

    # Crea una nueva dirección
    new_address = Address(
        address=new_address_data["address"],
        codigo_postal=new_address_data["codigo_postal"],
        ciudad=new_address_data["ciudad"],
        pais=new_address_data["pais"]
    )

    try:
        # Guarda la nueva dirección en la base de datos
        db.session.add(new_address)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Error al intentar guardar la dirección"}), 500  # Si hay algún problema al guardar

    return jsonify({"message": "Dirección agregada exitosamente"}), 201  # Devuelve mensaje de éxito

# Actualizar una dirección existente
@api.route('/address/<int:address_id>', methods=['PUT'])
def update_address(address_id):
    address = Address.query.get(address_id)  # Obtiene la dirección por ID

    if address is None:
        return jsonify({"error": "Dirección no encontrada"}), 404  # Si no se encuentra, devuelve error 404

    data = request.get_json()  # Obtiene los datos de la solicitud

    if not data:  # Verifica que los datos no estén vacíos
        return jsonify({"error": "No se proporcionaron datos para la actualización"}), 400

    # Actualiza los campos solo si fueron proporcionados en la solicitud
    if 'address' in data:
        address.address = data['address']
    if 'codigo_postal' in data:
        address.codigo_postal = data['codigo_postal']
    if 'ciudad' in data:
        address.ciudad = data['ciudad']
    if 'pais' in data:
        address.pais = data['pais']

    db.session.commit()  # Guarda los cambios en la base de datos

    return jsonify({"message": "Dirección actualizada exitosamente"}), 200  # Devuelve mensaje de éxito

# Eliminar una dirección
@api.route('/address/<int:address_id>', methods=['DELETE'])
def delete_address(address_id):
    address = Address.query.get(address_id)  # Obtiene la dirección por ID

    if address is None:
        return jsonify({"error": "Dirección no encontrada"}), 404  # Devuelve un error 404 si no se encuentra

    db.session.delete(address)  # Elimina la dirección de la base de datos
    db.session.commit()  # Confirma la transacción

    return jsonify({"message": "Dirección eliminada exitosamente"}), 200  # Devuelve mensaje de éxito

