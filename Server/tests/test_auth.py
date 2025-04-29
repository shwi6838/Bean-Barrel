import pytest
from flask import Flask, session
from auth.routes import auth
import Database.brew_data as db

@pytest.fixture
def app():
    app = Flask(__name__)
    app.secret_key = "123456"
    app.register_blueprint(auth, url_prefix='/auth')
    return app

@pytest.fixture
def client(app):
    return app.test_client()

def test_login_success(client):
    """测试成功登录"""
    response = client.post('/auth/login', json={
        'username': 'test_user',
        'password': 'test_password'
    })
    assert response.status_code == 200
    assert response.json['success'] == True

def test_login_failure(client):
    """测试登录失败"""
    response = client.post('/auth/login', json={
        'username': 'wrong_user',
        'password': 'wrong_password'
    })
    assert response.status_code == 200
    assert response.json['success'] == False

def test_register_success(client):
    """测试成功注册"""
    response = client.post('/auth/register', json={
        'name': 'New User',
        'phone': '1234567890',
        'username': 'new_user',
        'password': 'new_password'
    })
    assert response.status_code == 200
    assert response.json['success'] == True

def test_register_duplicate(client):
    """测试重复注册"""
    # 先注册一次
    client.post('/auth/register', json={
        'name': 'Duplicate User',
        'phone': '1234567890',
        'username': 'duplicate_user',
        'password': 'password'
    })
    # 尝试重复注册
    response = client.post('/auth/register', json={
        'name': 'Duplicate User',
        'phone': '1234567890',
        'username': 'duplicate_user',
        'password': 'password'
    })
    assert response.status_code == 200
    assert response.json['success'] == False

def test_logout(client):
    """测试登出功能"""
    # 先登录
    client.post('/auth/login', json={
        'username': 'test_user',
        'password': 'test_password'
    })
    # 然后登出
    response = client.post('/auth/logout')
    assert response.status_code == 200
    assert response.json['success'] == True

def test_get_user_info(client):
    """测试获取用户信息"""
    # 先登录
    client.post('/auth/login', json={
        'username': 'test_user',
        'password': 'test_password'
    })
    # 获取用户信息
    response = client.get('/auth/api/users')
    assert response.status_code == 200
    assert 'users' in response.json
    assert len(response.json['users']) > 0

def test_update_user_info(client):
    """测试更新用户信息"""
    # 先登录
    client.post('/auth/login', json={
        'username': 'test_user',
        'password': 'test_password'
    })
    # 更新用户信息
    response = client.post('/auth/update', json={
        'email': 'new_email@test.com',
        'phone': '9876543210',
        'name': 'Updated Name'
    })
    assert response.status_code == 200
    assert 'username' in response.json
    assert 'phone' in response.json
    assert 'name' in response.json 