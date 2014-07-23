from setuptools import setup, find_packages

setup(name='One Thousand Pens',
      version='0.01',
      description='communal storytelling site',
      author='Some dudes',
      package_dir={'':'src'},
      packages=find_packages('src'),
      install_requires=[
          'coverage',
          'sqlalchemy',
          'flask',
          'flask-sqlalchemy',
          'flask-restful',
          'flask-socketio'
      ],
      test_suite='tests'
     )