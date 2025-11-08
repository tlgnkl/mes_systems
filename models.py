from sqlalchemy import Column, Integer, String, Text
from database import Base

class Item(Base):
    """
    Модель предмета (аналог таблицы в БД)
    Каждый атрибут класса - колонка в таблице
    """
    
    # Имя таблицы в базе данных
    __tablename__ = "items"
    
    # ID - первичный ключ, автоинкремент
    # index=True - создает индекс для ускорения поиска
    id = Column(Integer, primary_key=True, index=True)
    
    # Название предмета, строка максимум 100 символов
    # index=True - индекс для поиска по названию
    title = Column(String(100), index=True)
    
    # Описание, текстовое поле, может быть пустым
    description = Column(Text, nullable=True)
    
    # Цена, целое число, может быть пустым
    price = Column(Integer, nullable=True)
    
    def __repr__(self):
        """Строковое представление объекта для отладки"""
        return f"<Item(id={self.id}, title='{self.title}', price={self.price})>"
