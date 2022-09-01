import * as Yup from "yup";
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { useEffect, useState } from "react";
import { Formik, Field, FormikProps, FormikValues, ErrorMessage } from "formik";
import { Alert } from "react-bootstrap";


function App() {

  const dataPersonas = [
    { id: 1, nombre: "César", azucar: 71, grasa: 89, oxigeno: 59, riesgo: "" },
    { id: 2, nombre: "Dayana", azucar: 51, grasa: 63, oxigeno: 61, riesgo: "" },
    { id: 3, nombre: "Maria", azucar: 49, grasa: 60, oxigeno: 75, riesgo: "" },


  ];

  const [data, setData] = useState(dataPersonas);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  

  const [personaSeleccionada, setPersonaSeleccionada] = useState({
    id: '',
    nombre: '',
    azucar: '',
    grasa: '',
    oxigeno: '',
    riesgo: ""
  });

  const schema = Yup.object().shape({
    nombre: Yup.string().required('Campo obligatorio'),
    azucar: Yup.number().required('Campo obligatorio'),
    grasa: Yup.string().required('Campo obligatorio'),
    oxigeno: Yup.string().required('Campo obligatorio'),
  });
  
  const seleccionarPersona = (elemento, caso) => {
    setPersonaSeleccionada(elemento);
    (caso === 'Editar') ? setModalEditar(true) : setModalEliminar(true)
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setPersonaSeleccionada((prevState) => ({
      ...prevState,
      [name]: value
    }));

  }

  const editar = () => {
    var dataNueva = data;
    dataNueva.map(persona => {
      if (persona.id === personaSeleccionada.id) {
        persona.nombre = personaSeleccionada.nombre;
        persona.azucar = personaSeleccionada.azucar;
        persona.grasa = personaSeleccionada.grasa;
        persona.oxigeno = personaSeleccionada.oxigeno;

      }
    });
    setData(dataNueva);
    calcular();
    setModalEditar(false);
  }

  const eliminar = () => {
    setData(data.filter(persona => persona.id !== personaSeleccionada.id));
    setModalEliminar(false);
  }
  const calcular = () => {
    var dataNueva = data;
    dataNueva.map(persona => {
      if (persona.id === persona.id && persona.azucar > 70 && persona.grasa > 88.5 && persona.oxigeno < 60) {
        persona.riesgo = "ALTO"
      } if (persona.id === persona.id && persona.azucar >= 50 && persona.azucar <= 70 && persona.grasa >= 62.2 && persona.grasa <= 88.5 && persona.oxigeno >= 60 && persona.oxigeno <= 70) {
        persona.riesgo = "MEDIO"
      } if (persona.id === persona.id && persona.azucar < 50 && persona.grasa < 62.2 && persona.oxigeno > 70) {
        persona.riesgo = "BAJO"
      }
    });
    setData(dataNueva);
    setIsSuccess(true);
  }

  const abrirModalInsertar = () => {
    setPersonaSeleccionada(null);
    calcular();
    setModalInsertar(true);
  }

  const insertar = () => {
    var valorInsertar = personaSeleccionada;
    valorInsertar.id = data[data.length - 1].id + 1;
    var dataNueva = data;
    if (personaSeleccionada.azucar > 100) {
      alert('El valor de la azúcar debe ser igual o menor a 100')
      // terminar la validación 
    } else {
      
      dataNueva.push(valorInsertar);
      setData(dataNueva);
      calcular();
      setModalInsertar(false);
    }
  }

  useEffect(() => {
    calcular();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setIsSuccess(false);
    }
  }, [isSuccess]);

  return (
    <Formik
      enableReinitialize
      initialValues={personaSeleccionada}
      validationSchema={schema}
    >

      <div className="container mt-3">
        <h2>Riesgo de personas a contraer la enfermedad</h2>
        <p>
          <span>
            Porcentaje de azúcar mayor a 70%, porcentaje de grasa mayor a 88.5% y porcentaje de
            oxígeno menor al 60% tenían un riesgo ALTO de enfermar gravemente.
          </span>
        </p>
        <p>
          <span>
            Porcentaje de azúcar entre 50% y 70% , porcentaje de grasa entre 62.2% y 88.5%, y porcentaje de
            oxígeno entre 60% y 70% tenían un riesgo MEDIO de enfermar gravemente.
          </span>
        </p>
        <p>
          <span>
            Porcentaje de azúcar menor a 50%, porcentaje de grasa menor a 62.2% y porcentaje de
            oxígeno mayor a 70% tienen un riesgo BAJO de enfermar gravemente.
          </span>
        </p>
        <br />
        <button className="btn btn-success" onClick={() => abrirModalInsertar()}>Insertar persona</button>
        <br /><br />
        <table className="table table-bordered">
          <thead>
            <tr>

              <th>Nombre</th>
              <th>Azúcar</th>
              <th>Grasa</th>
              <th>Oxigeno</th>
              <th>Riesgo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map(elemento => (
              <tr>

                <td>{elemento.nombre} </td>
                <td>{elemento.azucar}%</td>
                <td>{elemento.grasa}%</td>
                <td>{elemento.oxigeno}%</td>
                <td>{elemento.riesgo}</td>
                <td><button className="btn btn-primary me-2" onClick={() => seleccionarPersona(elemento, 'Editar')}>Editar</button> {"   "}
                  <button className="btn btn-danger" onClick={() => seleccionarPersona(elemento, 'Eliminar')}>Eliminar</button></td>
              </tr>
            ))
            }
          </tbody>
        </table>

        <Modal isOpen={modalEditar}>

          <ModalHeader>
            <div>
              <h3>Editar datos de persona</h3>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">

              <label>Nombre</label>
              <Field
                className="form-control"
                type="text"
                name="nombre"
                value={personaSeleccionada && personaSeleccionada.nombre}
                onChange={handleChange}
              />
              <br />

              <label>Azúcar</label>
              <Field
                className="form-control"
                type="text"
                name="azucar"
                value={personaSeleccionada && personaSeleccionada.azucar}
                onChange={handleChange}
              />
              <br />

              <label>Grasa</label>
              <Field
                className="form-control"
                type="text"
                name="grasa"
                value={personaSeleccionada && personaSeleccionada.grasa}
                onChange={handleChange}
              />
              <br />

              <label>Oxigeno</label>
              <Field
                className="form-control"
                type="text"
                name="oxigeno"
                value={personaSeleccionada && personaSeleccionada.oxigeno}
                onChange={handleChange}
              />
              <br />
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-primary" onClick={() => editar()}>
              Actualizar
            </button>
            <button
              className="btn btn-danger"
              onClick={() => setModalEditar(false)}
            >
              Cancelar
            </button>
          </ModalFooter>
        </Modal>


        <Modal isOpen={modalEliminar}>
          <ModalBody>
            Estás Seguro que deseas eliminar la persona {personaSeleccionada && personaSeleccionada.nombre}
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={() => eliminar()}>
              Sí
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setModalEliminar(false)}
            >
              No
            </button>
          </ModalFooter>

        </Modal>


        <Modal isOpen={modalInsertar}>
          <ModalHeader>
            <div>
              <h3>ingresar datos</h3>
            </div>
          </ModalHeader>

          <ModalBody>
            <div className="form-group">


              <label>Nombre</label>
              <Field
                className="form-control"
                type="text"
                name="nombre"
                value={personaSeleccionada && personaSeleccionada.nombre}
                onChange={handleChange}
                
              />
              <ErrorMessage name="nombre" withCount max={4} />
              <br />

              <label>Azúcar</label>
              <Field
                className="form-control"
                type="number"
                name="azucar"
                value={personaSeleccionada && personaSeleccionada.azucar}
                // onChange={handleChange}
                min={0}
                max={100}
                onChange={(e) => {
                  e.preventDefault();
                  const { value } = e.target;
                  const regex = /^[0-9]{0,3}$/;
                  if (regex.test(value.toString())) {
                    handleChange(e);
                  }
                }}
              />
              <ErrorMessage name="azucar" withCount max={3} />

              <br />

              <label>Grasa</label>
              <Field
                className="form-control"
                type="text"
                name="grasa"
                value={personaSeleccionada && personaSeleccionada.garsa}
                onChange={handleChange}
              />
              <br />

              <label>Oxigeno</label>
              <Field
                className="form-control"
                type="text"
                name="oxigeno"
                value={personaSeleccionada && personaSeleccionada.oxigeno}
                onChange={handleChange}
              />
              <br />
            </div>
          </ModalBody>

          <ModalFooter>
            <button className="btn btn-primary"
              onClick={() => insertar()}>
              Insertar
            </button>
            <button
              className="btn btn-danger"
              onClick={() => setModalInsertar(false)}
            >
              Cancelar
            </button>
          </ModalFooter>
        </Modal>
      </div>
    </Formik>
  );
}

export default App;
