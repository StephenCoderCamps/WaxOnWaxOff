using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.CodeAnalysis;

namespace CSharpTestHelper
{
    // This project can output the Class library as a NuGet Package.
    // To enable this option, right-click on the project and select the Properties menu item. In the Build tab select "Produce outputs on build".
    public class Helper
    {

        public static string GetFullClassName(string name)
        {
            return Assembly.CreateQualifiedName("userCode", name);
        }

        public static object InvokeMethod(string className, string methodName, params object[] parameters)
        {
            // Create instance of class
            var type = Type.GetType(className);
            var instance = Activator.CreateInstance(type);

            // get method
            var method = type.GetTypeInfo().GetMethod(methodName);
            if (method == null)
            {
                throw new TestResult(methodName + " method does not exist!");
            }

            // invoke it
            return method.Invoke(instance, parameters);
        }

        //public object GetPropertyValue<T>(string propertyName)
        //{
        //    // create instance of class
        //    var instance = Activator.CreateInstance(typeof(T));

        //    // get property
        //    var property = typeof(T).GetTypeInfo().GetProperty(propertyName);
        //    if (property == null)
        //    {
        //        throw new TestResult(propertyName + " property does not exist!");
        //    }

        //    // invoke it
        //    return property.GetValue(instance);
        //}

        //public void SetPropertyValue<T>(string propertyName, object value)
        //{
        //    // create instance of class
        //    var instance = Activator.CreateInstance(typeof(T));

        //    // get property
        //    var property = typeof(T).GetTypeInfo().GetProperty(propertyName);
        //    if (property == null)
        //    {
        //        throw new TestResult(propertyName + " property does not exist!");
        //    }

        //    // set it
        //    property.SetValue(instance, value);
        //}


        //public IEnumerable<PropertyInfo> GetProperties<T>()
        //{
        //    var type = typeof(T);
        //    return type.GetRuntimeProperties();
        //}


        //public ISymbol GetSymbol(string symbolName)
        //{
        //    var result =  _compilation.GetSymbolsWithName(s => s == symbolName).FirstOrDefault();
        //    return result;
        //}


    }
}
